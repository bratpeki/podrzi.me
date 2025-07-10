insert into `user` (username, `password`, displayname, `desc`) values ('korisnik1', 'lozinka', 'prikaznoime', 'ovo je opis korisnika vuhu');
insert into `action` (goal, collected, `name`, `desc`, visible) values (5000, 300.45, 'akcija1', 'ovo je opis akcije vuhu', true);

select * from mydb.user;
select * from mydb.action;

-- promjeniti id akcije i korisnika na validne vrijednosti, zavisi sta ce se staviti kao id korisnika i akcije
insert into `donation` (amount, idAction, idUser, donationTime) values (20, 6, 16, '2025-05-13 12:15:22');