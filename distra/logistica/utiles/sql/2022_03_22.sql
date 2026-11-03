CREATE OR REPLACE FUNCTION mod_datosmaestros.ft_insertar_nodo_nomindicador (
)
RETURNS SETOF trigger AS
$body$
DECLARE

v_derecha bigint;

v_orden numeric;

v_ordenrec record;

v_padre record;

v_path public.ltree;

v_conf record;

BEGIN

set search_path = mod_datosmaestros;

if new.idindicador = 0 or new.idpadre is null then

    new.idpadre := new.idindicador; 

    new.idarbol := new.idindicador;  

    new.nivel := 1;  
	select c.idformato, c.gencodigo,pf.longitud  into  v_conf 
	from mod_datosmaestros.conf_maestropordserv c
    inner join mod_datosmaestros.dat_parteformato pf on pf.idformato = c.idformato
	where c.activo = 1  and pf.nivel = 1 limit 1;  
    -- cambio realizado 
    select coalesce(max(i.orden),0) + 1 as orden,coalesce(max(codigo)::numeric,0) + 1 as codigo into v_ordenrec 
    	from mod_datosmaestros.nom_indicador i 
    	where nivel = 1;
        
     new.orden = v_ordenrec.orden;
     if  v_conf.gencodigo = 1 then        
        new.codigo:= lpad(v_ordenrec.codigo::text,v_conf.longitud::integer,'0'::text);
        NEW.idformato = v_conf.idformato;
    end if;
end if;	    

if new.idindicador != new.idpadre then
	
    select i.ordender, i.idarbol, i.nivel, i.arridtablas, i.arridtablasgenerales, i.idformato, i.idespecialidad, i.idpais into v_padre 

    from nom_indicador i where i.idindicador = new.idpadre; 

    new.idarbol := v_padre.idarbol;		  	

    new.nivel := v_padre.nivel + 1;
    
    select c.idformato, c.gencodigo,pf.longitud  into  v_conf 
	from mod_datosmaestros.conf_maestropordserv c
    inner join mod_datosmaestros.dat_parteformato pf on pf.idformato = c.idformato
	where c.activo = 1  and pf.nivel = new.nivel limit 1;
    if  v_conf.gencodigo = 1 then
      NEW.idformato = v_conf.idformato;
      select coalesce(max(i.orden),0) + 1 into v_orden 
          from mod_datosmaestros.nom_indicador i
          where i.idpadre = new.idpadre and i.idindicador <> i.idpadre;
      v_orden := coalesce(v_orden,0);
      new.orden = v_orden;	
      new.codigo:= (select ii.codigo 
      	from mod_datosmaestros.nom_indicador ii where ii.idindicador = new.idpadre)||''|| lpad(v_orden::text,v_conf.longitud::integer,'0'::text);
    end if;

    v_derecha := v_padre.ordender;    

    if (new.idformato is null) then new.idformato := v_padre.idformato; end if;    

    if (new.idespecialidad is null) then new.idespecialidad := v_padre.idespecialidad; end if;    

    if (new.idpais is null) then new.idpais := v_padre.idpais; end if; 

    update nom_indicador set ordender = ordender + 2 where ordender >= v_derecha and new.idarbol = idarbol;

    update nom_indicador set ordenizq = ordenizq + 2 where ordenizq > v_derecha and new.idarbol = idarbol;

    new.ordenizq := v_derecha;

    new.ordender := v_derecha + 1;   

    

    new.arridtablas := v_padre.arridtablas || ',' || new.idtabla;

    new.arridtablasgenerales := v_padre.arridtablasgenerales || ',' || new.idtablageneral;   
    
    select i.parentpath into v_path from mod_datosmaestros.nom_indicador i where i.idindicador = new.idpadre;       
	new.parentpath = public.text2ltree(public.ltree2text(v_path)||'.'||new.idindicador);
    
else		
	new.parentpath = (cast(new.idindicador as varchar))::public.ltree;  
    
    new.ordenizq := 1;

    new.ordender := 2;

    new.nivel := 1;

    new.idarbol := new.idindicador;  

    new.arridtablas := new.idtabla;

    new.arridtablasgenerales := new.idtablageneral;  			

end if;

return new; 

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;