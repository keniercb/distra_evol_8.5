SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'mod_logtaller'
AND table_name = 'dat_ordentrabajo'
AND column_name = 'idcarnetresponsable';
ALTER TABLE mod_logtaller.dat_ordentrabajo 
ALTER COLUMN idcarnetresponsable TYPE VARCHAR(20);