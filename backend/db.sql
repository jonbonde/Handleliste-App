create table if not exists items
(
	id serial primary key,
	item_name text not null unique
);

create table if not exists shopping_lists
(
	id serial primary key,
	created_at timestamptz default now()
);

alter table shopping_lists 
add column list_name text;

CREATE OR REPLACE FUNCTION insert_item(
    name TEXT
)
RETURNS JSONB AS
$$
DECLARE
    new_item JSONB;
BEGIN
    INSERT INTO items(item_name)
    VALUES (name)
    RETURNING to_jsonb(items) INTO new_item;
    
    RETURN new_item;
END;
$$
LANGUAGE plpgsql;

ALTER TABLE shopping_lists
ALTER COLUMN created_at SET DEFAULT NOW();

create table if not exists items_on_list
(
	item_id int,
	list_id int,
	primary key (item_id, list_id),
	constraint fk_items foreign key (item_id) references items(id),
	constraint fk_carts foreign key (list_id) references shopping_lists(id)
);

create or replace function insert_list(name text) returns jsonb as $$
declare new_list jsonb;
begin
	insert into shopping_lists(list_name)
	values ($1)
	returning to_jsonb(shopping_lists) into new_list;

	return new_list;
end;
$$ language plpgsql;

create or replace function add_item_to_list(item_id int, list_id int) returns jsonb as $$
declare updated_list jsonb;
begin 
	insert into items_on_list(item_id, list_id)
	values ($1, $2)
	returning to_jsonb(items_on_list) into updated_list;

	return updated_list;
end;
$$ language plpgsql;

create or replace function get_items() returns jsonb as $$
declare all_items jsonb;
begin 
	select jsonb_agg(items.*)
	into all_items
	from items;

	return all_items;
end;
$$ language plpgsql;

create or replace function get_lists() returns jsonb as $$
declare all_lists jsonb;
begin
	select jsonb_agg(shopping_lists.*)
	into all_lists
	from shopping_lists;

	return all_lists;
end; $$ language plpgsql;

CREATE OR REPLACE FUNCTION get_items_on_list(list_id int) RETURNS jsonb AS $$
BEGIN 
    RETURN (
        SELECT jsonb_agg(i.* ORDER BY iol.item_id)
        FROM items_on_list iol
        LEFT JOIN items i ON i.id = iol.item_id
        WHERE iol.list_id = $1
    );
END;
$$ LANGUAGE plpgsql;

create or replace function get_my_list(list_id int) returns jsonb as $$
declare
	items_list jsonb;
begin
	items_list := (select get_items_on_list($1));
	
	return (select json_build_object(
		'id', sl.id,
		'created_at', sl.created_at,
		'list_name', sl.list_name,
		'items', items_list
	)
	from shopping_lists sl
	where sl.id = $1);
end; $$ language plpgsql;

create or replace function delete_from_list(item_id int, list_id int) returns jsonb as $$
begin 
	delete from items_on_list iol where iol.item_id = $1 and iol.list_id = $2;

	return (select get_my_list($2));
end; $$ language plpgsql;

alter table items_on_list 
add is_completed boolean default false;

update items_on_list
set is_completed = false 
where is_completed is null;

create or replace function strike_out(id_item int, id_list int) returns jsonb as $$
begin
	update items_on_list
	set is_completed = not is_completed
	where item_id = $1 and list_id = $2;

	return (select json_build_object(
			'item_id', $1,
			'list_id', $2,
			'is_completed', iol.is_completed
			)
		from items_on_list iol
		where item_id = $1 and list_id = $2);	
end; $$ language plpgsql;

create or replace function get_items_on_lists(id_list int) returns jsonb as $$
begin 
    return (
        select jsonb_agg(items_ordered.*)
        from (
            select *
            from items_on_list
            where list_id = id_list
            order by item_id
        ) as items_ordered
    );
end;
$$ language plpgsql;

create or replace function delete_list(list_id int) returns jsonb as $$
begin 
	delete from items_on_list iol where iol.list_id = $1;
	delete from shopping_lists sl where sl.id = $1;

	return (select get_lists());
end; $$ language plpgsql;
select delete_list(8);

select * from shopping_lists sl ;
select * from items i ;
select * from items_on_list iol ;

create role web_anon nologin;

GRANT ALL PRIVILEGES ON DATABASE postgres TO web_anon;
grant all privileges on all tables in schema public to web_anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO web_anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to web_anon;
