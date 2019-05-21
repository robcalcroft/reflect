create table cards (
	id int generated by default as identity primary key,
	name text not null,
	list_id int not null references lists(id) on delete cascade on update cascade,
	user_id int not null references users(id) on delete cascade on update cascade,
    	description text,
	created_at timestamptz default now(),
	position int not null
);
