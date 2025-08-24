USE pdme;

INSERT INTO `Admin` (`username`, `password`, `owner`)
VALUES (
    "admin", -- username
    "$2a$10$omkBPbTTiU2M3/wr8rAi/utXS9djDy/uOPGGgo6dDeCYALqYU77c.", -- password, Spring-ov default je bcrypt, snaga 10
    1 -- owner
);

INSERT INTO `User` (idUser, displayName)
VALUES (
  58,
  "Guest"
);