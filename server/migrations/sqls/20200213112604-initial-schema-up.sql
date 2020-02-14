-- Last modification date: 2020-02-12 15:11:49.014

-- tables
-- Table: address
CREATE TABLE address (
    id serial  NOT NULL,
    address_1 varchar(32)  NOT NULL,
    address_2 varchar(32)  NOT NULL,
    postcode varchar(32)  NOT NULL,
    city varchar(32)  NOT NULL,
    region varchar(32)  NOT NULL,
    lat decimal(7,10)  NOT NULL,
    long decimal(7,10)  NOT NULL,
    CONSTRAINT address_pk PRIMARY KEY (id)
);

-- Table: cause
CREATE TABLE cause (
    id serial  NOT NULL,
    name varchar(32)  NOT NULL,
    description varchar(32)  NOT NULL,
    CONSTRAINT cause_pk PRIMARY KEY (id)
);

-- Table: event
CREATE TABLE event (
    id serial  NOT NULL,
    name varchar(32)  NOT NULL,
    organisation_id int  NULL,
    address_id int  NOT NULL,
    women_only boolean  NOT NULL,
    spots int  NOT NULL,
    address_visible boolean  NOT NULL,
    minimum_age int  NOT NULL,
    photo_id boolean  NOT NULL,
    physical boolean  NOT NULL,
    add_info boolean  NOT NULL,
    content text  NOT NULL,
    date date  NOT NULL,
    time time  NOT NULL,
    CONSTRAINT event_pk PRIMARY KEY (id)
);

-- Table: event_cause
CREATE TABLE event_cause (
    event_id int  NOT NULL,
    cause_id int  NOT NULL,
    CONSTRAINT event_cause_pk PRIMARY KEY (event_id,cause_id)
);

-- Table: favourite
CREATE TABLE favourite (
    individual_id int  NOT NULL,
    event_id int  NOT NULL,
    CONSTRAINT favourite_pk PRIMARY KEY (individual_id,event_id)
);

-- Table: individual
CREATE TABLE individual (
    id serial  NOT NULL,
    firstname varchar(32)  NOT NULL,
    lastname varchar(32)  NOT NULL,
    date_registered date  NOT NULL,
    email varchar(32)  NOT NULL,
    phone varchar(32)  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT individual_ak_1 UNIQUE (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT individual_pk PRIMARY KEY (id)
);

-- Table: information
CREATE TABLE information (
    type varchar(32)  NOT NULL,
    content text  NOT NULL,
    CONSTRAINT information_pk PRIMARY KEY (type)
);

-- Table: organisation
CREATE TABLE organisation (
    id serial  NOT NULL,
    name varchar(32)  NOT NULL,
    charity_number varchar(32)  NOT NULL,
    date_registered date  NOT NULL,
    email varchar(32)  NOT NULL,
    phone varchar(32)  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT organisation_ak_1 UNIQUE (charity_number) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT organisation_ak_2 UNIQUE (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT organisation_pk PRIMARY KEY (id)
);

-- Table: picture
CREATE TABLE picture (
    id serial  NOT NULL,
    profile_id int  NOT NULL,
    picture bytea  NOT NULL,
    CONSTRAINT picture_pk PRIMARY KEY (id)
);

-- Table: profile
CREATE TABLE profile (
    id serial  NOT NULL,
    birthday date  NOT NULL,
    gender char(1)  NOT NULL,
    address_id int  NOT NULL,
    individual_id int  NOT NULL,
    karma_points int  NOT NULL,
    CONSTRAINT profile_pk PRIMARY KEY (id)
);

-- Table: registration
CREATE TABLE registration (
    email varchar(32)  NOT NULL,
    email_flag int  NOT NULL,
    id_flag int  NOT NULL,
    phone_flag int  NOT NULL,
    sign_up_flag int  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT registration_pk PRIMARY KEY (email)
);

-- Table: reset
CREATE TABLE reset (
    id serial  NOT NULL,
    user_id int  NOT NULL,
    password_token varchar(64)  NOT NULL,
    expiry_date timestamp  NOT NULL,
    succesful boolean  NOT NULL,
    CONSTRAINT reset_pk PRIMARY KEY (id)
);

-- Table: selected_cause
CREATE TABLE selected_cause (
    user_id int  NOT NULL,
    cause_id int  NOT NULL,
    CONSTRAINT selected_cause_pk PRIMARY KEY (user_id,cause_id)
);

-- Table: setting
CREATE TABLE setting (
    user_id int  NOT NULL,
    email int  NOT NULL,
    notifications int  NOT NULL,
    CONSTRAINT setting_pk PRIMARY KEY (user_id)
);

-- Table: sign_up
CREATE TABLE sign_up (
    individual_id int  NOT NULL,
    event_id int  NOT NULL,
    confirmed boolean  NOT NULL,
    CONSTRAINT sign_up_pk PRIMARY KEY (individual_id,event_id)
);

-- Table: user
CREATE TABLE "user" (
    id serial  NOT NULL,
    username varchar(64)  NOT NULL,
    password varchar(32)  NOT NULL,
    verified boolean  NOT NULL,
    salt varchar(64)  NOT NULL,
    CONSTRAINT user_ak_1 UNIQUE (username) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT user_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: event_address (table: event)
ALTER TABLE event ADD CONSTRAINT event_address
    FOREIGN KEY (address_id)
    REFERENCES address (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: event_organisation (table: event)
ALTER TABLE event ADD CONSTRAINT event_organisation
    FOREIGN KEY (organisation_id)
    REFERENCES organisation (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: eventcause_cause (table: event_cause)
ALTER TABLE event_cause ADD CONSTRAINT eventcause_cause
    FOREIGN KEY (cause_id)
    REFERENCES cause (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: eventcause_event (table: event_cause)
ALTER TABLE event_cause ADD CONSTRAINT eventcause_event
    FOREIGN KEY (event_id)
    REFERENCES event (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: favourite_event (table: favourite)
ALTER TABLE favourite ADD CONSTRAINT favourite_event
    FOREIGN KEY (event_id)
    REFERENCES event (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: favourite_individual (table: favourite)
ALTER TABLE favourite ADD CONSTRAINT favourite_individual
    FOREIGN KEY (individual_id)
    REFERENCES individual (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: individual_user (table: individual)
ALTER TABLE individual ADD CONSTRAINT individual_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: organisation_user (table: organisation)
ALTER TABLE organisation ADD CONSTRAINT organisation_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: picture_profile (table: picture)
ALTER TABLE picture ADD CONSTRAINT picture_profile
    FOREIGN KEY (profile_id)
    REFERENCES profile (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: profile_address (table: profile)
ALTER TABLE profile ADD CONSTRAINT profile_address
    FOREIGN KEY (address_id)
    REFERENCES address (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: profile_individual (table: profile)
ALTER TABLE profile ADD CONSTRAINT profile_individual
    FOREIGN KEY (individual_id)
    REFERENCES individual (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: registration_user (table: registration)
ALTER TABLE registration ADD CONSTRAINT registration_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: reset_user (table: reset)
ALTER TABLE reset ADD CONSTRAINT reset_user
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: selectedcause_cause (table: selected_cause)
ALTER TABLE selected_cause ADD CONSTRAINT selectedcause_cause
    FOREIGN KEY (cause_id)
    REFERENCES cause (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: selectedcause_user (table: selected_cause)
ALTER TABLE selected_cause ADD CONSTRAINT selectedcause_user
    FOREIGN KEY (cause_id)
    REFERENCES "user" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: signup_event (table: sign_up)
ALTER TABLE sign_up ADD CONSTRAINT signup_event
    FOREIGN KEY (event_id)
    REFERENCES event (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: signup_individual (table: sign_up)
ALTER TABLE sign_up ADD CONSTRAINT signup_individual
    FOREIGN KEY (individual_id)
    REFERENCES individual (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_settings (table: setting)
ALTER TABLE setting ADD CONSTRAINT user_settings
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;
-- End of file.
