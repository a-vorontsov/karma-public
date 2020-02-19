-- Last modification date: 2020-02-18 16:08:18.356

-- foreign keys
ALTER TABLE authentication
    DROP CONSTRAINT authentication_user;

ALTER TABLE complaint
    DROP CONSTRAINT complaint_user;

ALTER TABLE event
    DROP CONSTRAINT event_address;

ALTER TABLE event
    DROP CONSTRAINT event_user;

ALTER TABLE event_cause
    DROP CONSTRAINT eventcause_cause;

ALTER TABLE event_cause
    DROP CONSTRAINT eventcause_event;

ALTER TABLE favourite
    DROP CONSTRAINT favourite_event;

ALTER TABLE favourite
    DROP CONSTRAINT favourite_individual;

ALTER TABLE individual
    DROP CONSTRAINT individual_address;

ALTER TABLE individual
    DROP CONSTRAINT individual_picture;

ALTER TABLE individual
    DROP CONSTRAINT individual_user;

ALTER TABLE notification
    DROP CONSTRAINT notification_user_receiver;

ALTER TABLE notification
    DROP CONSTRAINT notification_user_sender;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_address;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_picture;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_user;

ALTER TABLE profile
    DROP CONSTRAINT profile_individual;

ALTER TABLE registration
    DROP CONSTRAINT registration_user;

ALTER TABLE report_user
    DROP CONSTRAINT report_user_reported;

ALTER TABLE report_user
    DROP CONSTRAINT report_user_reporting;

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

DROP TABLE authentication;

DROP TABLE cause;

DROP TABLE complaint;

DROP TABLE event;

DROP TABLE event_cause;

DROP TABLE favourite;

DROP TABLE individual;

DROP TABLE information;

DROP TABLE notification;

DROP TABLE organisation;

DROP TABLE picture;

DROP TABLE profile;

DROP TABLE registration;

DROP TABLE report_user;

DROP TABLE reset;

DROP TABLE selected_cause;

DROP TABLE setting;

DROP TABLE sign_up;

DROP TABLE "user";

-- End of file.