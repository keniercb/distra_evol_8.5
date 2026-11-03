<?php
class ZendExt_History_Sql_History {
	
	function GetTables($limit, $offset) {
		$sql = "SELECT  information_schema.tables.table_name, information_schema.tables.table_schema
				FROM information_schema.tables
				WHERE (table_schema != 'information_schema') AND (table_schema != 'pg_catalog') AND (table_schema != 'mod_historial')
				GROUP BY information_schema.tables.table_name,information_schema.tables.table_schema
				ORDER BY  information_schema.tables.table_schema
			LIMIT $limit offset $offset";
		
		return $sql;
	}
	function GetTablesbySchema($schema, $limit, $start) {
		$sql = "SELECT  information_schema.tables.table_name, information_schema.tables.table_schema
				FROM information_schema.tables
				WHERE (table_schema != 'information_schema') AND (table_schema != 'pg_catalog')
				 AND (table_schema != 'mod_historial') AND (table_schema = '$schema')
				GROUP BY information_schema.tables.table_name,information_schema.tables.table_schema
				ORDER BY  information_schema.tables.table_schema
				LIMIT $limit offset $start";
		
		return $sql;
	}
	function createHistorial($schema, $table) {
		//$tabler .= '"' . $table . '"';
		//$schemar .= '"' . $schema . '"';
		$sql = "CREATE TABLE mod_historial.$table ( )
			   	WITH OIDS";
		return $sql;
	}
	function addfields($table, $field, $type, $default, $bandera) {
		
		$sql = "ALTER TABLE mod_historial.$table ADD COLUMN $field $type";
		if ($bandera) {
			$sql .= ";ALTER TABLE  mod_historial.$table ALTER COLUMN $field SET DEFAULT $default";
		}
		return $sql;
	}
	function setPK($table, $field) {
		$sql = "ALTER TABLE mod_historial.$table ADD PRIMARY KEY ($field)";
		return $sql;
	}
	function TablePk($table, $schema) {
		$sql = "select DISTINCT uc.column_name, ucc.constraint_type
				from information_schema.key_column_usage uc, information_schema.table_constraints ucc
				where uc.constraint_name = ucc.constraint_name and uc.table_name='$table'
				and ucc.constraint_type='PRIMARY KEY' and uc.table_schema = '$schema'";
		return $sql;
	}
	function createTableRelation($schema, $table, $field) {
		$tableConst .= $table . "_fk";
		$tableFk .= '"' . $table . '"';
		$sql = "ALTER TABLE mod_historial.$table
 		 ADD CONSTRAINT $tableConst FOREIGN KEY ($field)
    	REFERENCES $schema.$tableFk($field)
    	ON DELETE CASCADE
    	ON UPDATE CASCADE
    	NOT DEFERRABLE";
		return $sql;
	}
	function count($table) {
		$sql = "SELECT Count(*) AS cantidad FROM mod_historial.$table";
		return $sql;
	}
	function countTables($schema) {
		if (! $schema)
			$sql = "SELECT Count( information_schema.tables.table_name) AS cantidad
				FROM information_schema.tables
				WHERE (table_schema != 'information_schema') AND (table_schema != 'pg_catalog')AND (table_schema != 'mod_historial')";
		else
			$sql = "SELECT Count( information_schema.tables.table_name) AS cantidad
				FROM information_schema.tables
				WHERE table_schema = '$schema'";
		return $sql;
	}
	function dropHistorial($table) {
		$sql = "DROP TABLE mod_historial.$table";
		return $sql;
	}
	function gethistorial($limit = 10, $offset = 0) {
		if ($limit && $offset)
			$sql = "SELECT * FROM mod_historial.dat_historial LIMIT $limit OFFSET $offset";
		else
			$sql = "SELECT * FROM mod_historial.dat_historial";
		return $sql;
	}
	function uploadData($schema, $table) {
		$originaltable .= '"' . $table . '"';
		$sql = "INSERT INTO mod_historial.$table SELECT * FROM $schema.$originaltable";
		return $sql;
	}
	function tableExist($table) {
		$sql = "select dat_historial.table from mod_historial.dat_historial
				where dat_historial.table = '$table'";
		return $sql;
	}
	function pK($table) {
		$id .= 'id_' . $table;
		$sql = "ALTER TABLE mod_historial.$table ADD COLUMN $id INTEGER;
             ALTER TABLE mod_historial.$table ALTER COLUMN $id SET DEFAULT nextval('mod_historial.increment');
             ALTER TABLE mod_historial.$table ALTER COLUMN $id SET NOT NULL;
			 ALTER TABLE mod_historial.$table ADD PRIMARY KEY ($id)";
		return $sql;
	}
	function registrarcatalogo($table, $user, $schema) {
		$fecha = date ( 'd/m/Y' );
		$tabla = '"' . 'table' . '"';
		$fec = '"' . 'fecha' . '"';
		$creado = '"' . 'creado' . '"';
		$esquema = '"' . 'esquema' . '"';
		$sql = "INSERT INTO mod_historial.dat_historial ($tabla,$fec,$creado,$esquema) values('$table','$fecha','$user','$schema')";
		return $sql;
	}
	function table($table) {
		$sql = "Select * from mod_historial.dat_historial where dat_historial.table = '$table'";
		return $sql;
	}
	function deletecatalogo($id) {
		$sql = "Delete  from mod_historial.dat_historial where dat_historial.id_historial = '$id'";
		return $sql;
	}
	function schemas() {
		$sql = "Select information_schema.tables.table_schema
				FROM information_schema.tables WHERE (table_schema != 'information_schema')
				AND (table_schema != 'pg_catalog' AND table_schema != 'mod_historial' AND table_schema != 'public') 
				GROUP BY information_schema.tables.table_schema ";
		return $sql;
	}
	function tableAll($table, $limit, $offset) {
		$sql = "Select * FROM mod_historial.$table LIMIT $limit OFFSET $offset";
		return $sql;
	}
	function fieldTable($table,$bandera) {
		$sql = "SELECT  information_schema.columns.column_name FROM information_schema.columns
		WHERE
  		  information_schema.columns.table_schema != 'pg_catalog' AND 
		  information_schema.columns.table_schema != 'information_schema' AND 
		  information_schema.columns.table_schema = 'mod_historial' AND 
		  information_schema.columns.table_name = '$table'";
		  if($bandera)
		  $sql.=" AND column_name!='fecha_creacion' AND column_name!='operation'";
		return $sql;
	}
	function fieldTableAll($schema, $table) {
		$sql = "SELECT  column_name, column_default,data_type FROM information_schema.columns
		WHERE
  		  information_schema.columns.table_schema != 'pg_catalog' AND 
		  information_schema.columns.table_schema != 'information_schema' AND 
		  information_schema.columns.table_schema = '$schema' AND 
		  information_schema.columns.table_name = '$table'";
		return $sql;
	}
	function createfunction($schema, $function) {
		$esq = '"' . $schema . '"';
		$name = '"' . 'historial' . '"';
		$body = '$body$';
		$update .= ",'Update')";
		$insert .= ",'Insert')";
		$sql = "CREATE FUNCTION $esq.$name () RETURNS trigger AS
        $body 
        DECLARE 
        fecha date;
        BEGIN 
        fecha = CURRENT_DATE;
        IF(TG_OP = 'Update') THEN
        $function$update; return new;else $function$insert; return new;END IF; END; $body
        LANGUAGE 'plpgsql' VOLATILE CALLED ON NULL INPUT SECURITY INVOKER;";
		return $sql;
	}
	function createtrigger($schema, $table) {
		$triggername = '"' . 'dat_historial_tr' . '"';
		$procedure = '"' . 'historial' . '"';
		$esquema = '"' . $schema . '"';
		$tabla = '"' . $table . '"';
		$sql = "CREATE TRIGGER $triggername BEFORE INSERT OR UPDATE 
         ON $esquema.$tabla FOR EACH ROW 
         EXECUTE PROCEDURE $esquema.$procedure()";
		return $sql;
	}
	function eliminartrigger($schema, $table) {
		$nametrigger = '"' . 'dat_historial_tr' . '"';
		$nameschema = '"' . $schema . '"';
		$nametable = '"' . $table . '"';
		$sql = "DROP TRIGGER $nametrigger ON $nameschema.$nametable";
		return $sql;
	}
		function eliminartriggerfunction($schema) {
		$historialfunction = '"' . 'historial' . '"';
		$nameschema = '"' . $schema . '"';
		$sql = "=DROP FUNCTION $nameschema.$historialfunction ()";
		return $sql;
	}

}
