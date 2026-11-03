<?php
interface ZendExt_History_Interfaces_IHistory {
	
	public function getTables($limit, $offset);
	public function CreateHistorial($tables,$user);
	public function getHistorial($limit, $offset);
	public function DropHistorial($tables);
	public function Table($table);
	public function Schema();
	public function TableAll($table,$limit, $offset);
	public function FieldTable($table,$bandera);
	public function CountTables($schema);
}
