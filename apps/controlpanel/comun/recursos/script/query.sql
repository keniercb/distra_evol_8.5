--------------------- CONSULTA PARA OBTENER EL ESTADO ACTUAL DE LOS MECANISMOS DE CID
SELECT tg.oid::text || p.oid::text as oidhash
                        FROM pg_class c
                        left JOIN pg_trigger tg on tg.tgrelid = c.oid
                        left JOIN pg_proc p on p.oid = tg.tgfoid
                        WHERE c.relkind = 'r'::char and (tg.tgname = 't_cid') order by(tg.oid) asc
