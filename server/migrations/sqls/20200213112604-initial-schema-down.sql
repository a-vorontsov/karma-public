-- foreign keys
ALTER TABLE event
    DROP CONSTRAINT event_address;

ALTER TABLE event
    DROP CONSTRAINT event_organisation;

ALTER TABLE event_cause
    DROP CONSTRAINT eventcause_cause;

ALTER TABLE event_cause
    DROP CONSTRAINT eventcause_event;

ALTER TABLE favourite
    DROP CONSTRAINT favourite_event;

ALTER TABLE favourite
    DROP CONSTRAINT favourite_individual;

ALTER TABLE individual
    DROP CONSTRAINT individual_user;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_user;

ALTER TABLE picture
    DROP CONSTRAINT picture_profile;

ALTER TABLE profile
    DROP CONSTRAINT profile_address;

ALTER TABLE profile
    DROP CONSTRAINT profile_individual;

ALTER TABLE registration
    DROP CONSTRAINT registration_user;

ALTER TABLE reset
    DROP CONSTRAINT reset_user;

ALTER TABLE selected_cause
    DROP CONSTRAINT selectedcause_cause;

ALTER TABLE selected_cause
    DROP CONSTRAINT selectedcause_user;

ALTER TABLE sign_up
    DROP CONSTRAINT signup_event;

ALTER TABLE sign_up
    DROP CONSTRAINT signup_individual;

ALTER TABLE setting
    DROP CONSTRAINT user_settings;

-- tables
DROP TABLE address;

DROP TABLE cause;

DROP TABLE event;

DROP TABLE event_cause;

DROP TABLE favourite;

DROP TABLE individual;

DROP TABLE information;

DROP TABLE organisation;

DROP TABLE picture;

DROP TABLE profile;

DROP TABLE registration;

DROP TABLE reset;

DROP TABLE selected_cause;

DROP TABLE setting;

DROP TABLE sign_up;

DROP TABLE "user";

-- End of file.
