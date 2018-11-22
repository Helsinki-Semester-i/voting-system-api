CREATE TABLE wiki_user (
    id          serial PRIMARY KEY,
    first_name  varchar(50) NOT NULL,
    last_name   varchar(50) NOT NULL,
    email       varchar(50) UNIQUE NOT NULL ,
    phone       varchar(20) UNIQUE NOT NULL
);

CREATE TABLE poll (
    id                     serial,
    title                  varchar(200) NOT NULL,
    details                varchar(1500),
    creation_date          timestamp NOT NULL, 
    close_date             timestamp NOT NULL CHECK (close_date > creation_date),
    acceptance_percentage  int NOT NULL CHECK (acceptance_percentage >= 0 AND acceptance_percentage <= 100),
    anonymity              boolean,
    PRIMARY KEY (id, anonymity)
);

CREATE TYPE participation_status AS ENUM ('not seen', 'seen', 'voted');

CREATE TABLE participation (
    wiki_user_id      int REFERENCES wiki_user (id),
    poll_id           int,
    poll_anonymity    boolean,
    vote_status       participation_status NOT NULL,
    PRIMARY KEY (wiki_user_id, poll_id, poll_anonymity),
    FOREIGN KEY (poll_id, poll_anonymity) REFERENCES poll (id, anonymity)
);

CREATE TABLE open_question (
    poll_id              int,
    poll_anonymity       boolean,
    order_priority       int CHECK (order_priority > 0),
    question             varchar(300) NOT NULL,
    PRIMARY KEY (poll_id, poll_anonymity, order_priority),
    FOREIGN KEY (poll_id, poll_anonymity) REFERENCES poll (id, anonymity)
);

CREATE TABLE closed_question
(
    poll_id             int,
    poll_anonymity      boolean,
    order_priority      int CHECK (order_priority > 0),
    question            varchar(300) NOT NULL,
    PRIMARY KEY (poll_id, poll_anonymity, order_priority),
    FOREIGN KEY (poll_id, poll_anonymity) REFERENCES poll (id, anonymity)
);

CREATE TABLE closed_option
(
    poll_id                   int,
    poll_anonymity            boolean,
    question_order_priority   int,
    order_priority            int CHECK (order_priority > 0),
    option_text               varchar(300) NOT NULL,
    PRIMARY KEY (poll_id, poll_anonymity, question_order_priority, order_priority),
    FOREIGN KEY (poll_id, poll_anonymity) REFERENCES poll (id, anonymity),
    FOREIGN KEY (poll_id, poll_anonymity, question_order_priority) REFERENCES closed_question (poll_id, poll_anonymity, order_priority)
);

CREATE TABLE anonymous_ballot
(
    id                 serial PRIMARY KEY,
    poll_id            int,
    poll_anonymity     boolean,
    unique_code        varchar(8) UNIQUE NOT NULL,
    FOREIGN KEY (poll_id, poll_anonymity) REFERENCES poll (id, anonymity)
);

-- Should unique codes be unique or unique for each question?

CREATE TABLE ballot
(
    id                   serial PRIMARY KEY,
    wiki_user_id         int REFERENCES wiki_user (id),
    poll_id              int,
    poll_anonymity       boolean,
    unique_code          varchar(8) UNIQUE NOT NULL,
    FOREIGN KEY (poll_id, poll_anonymity) REFERENCES poll (id, anonymity),
    FOREIGN KEY (wiki_user_id, poll_id, poll_anonymity) REFERENCES participation (wiki_user_id, poll_id, poll_anonymity)
);


CREATE TABLE open_response (
    ballot_id            int REFERENCES ballot (id),
    poll_id              int,
    poll_anonymity       boolean,
    poll_priority        int,
    answer               varchar(1000),
    PRIMARY KEY (ballot_id, poll_id, poll_anonymity, poll_priority),
    FOREIGN KEY (poll_id, poll_anonymity, poll_priority) REFERENCES open_question (poll_id, poll_anonymity, order_priority)
);

CREATE TABLE closed_response (
    ballot_id            int REFERENCES ballot (id),
    poll_id              int,
    poll_anonymity       boolean,
    poll_priority        int,
    option_priority      int,
    PRIMARY KEY (ballot_id, poll_id, poll_anonymity, poll_priority),
    FOREIGN KEY (poll_id, poll_anonymity, poll_priority) REFERENCES closed_question (poll_id, poll_anonymity, order_priority),
    FOREIGN KEY (poll_id, poll_anonymity, poll_priority, option_priority) REFERENCES closed_option (poll_id, poll_anonymity, question_order_priority, order_priority)
);

CREATE TABLE anonymous_open_response (
    ballot_id            int REFERENCES anonymous_ballot (id),
    poll_id              int,
    poll_anonymity       boolean,
    poll_priority        int,
    answer               varchar(1000),
    PRIMARY KEY (ballot_id, poll_id, poll_anonymity, poll_priority),
    FOREIGN KEY (poll_id, poll_anonymity, poll_priority) REFERENCES open_question (poll_id, poll_anonymity, order_priority)
);

CREATE TABLE anonymous_closed_response (
    ballot_id            int REFERENCES anonymous_ballot (id),
    poll_id              int,
    poll_anonymity       boolean,
    poll_priority        int,
    option_priority      int,
    PRIMARY KEY (ballot_id, poll_id, poll_anonymity, poll_priority),
    FOREIGN KEY (poll_id, poll_anonymity, poll_priority) REFERENCES closed_question (poll_id, poll_anonymity, order_priority),
    FOREIGN KEY (poll_id, poll_anonymity, poll_priority, option_priority) REFERENCES closed_option (poll_id, poll_anonymity, question_order_priority, order_priority)
);
