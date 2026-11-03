<?php 
class DatEvalseguridadaccesoentidadesModel extends ZendExt_Model 
{
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEvalseguridadaccesoentidades $DatEvalseguridadaccesoentidades) 
    { 
        $DatEvalseguridadaccesoentidades->save();
    } 
 
   public function Actualizar(DatEvalseguridadaccesoentidades $DatEvalseguridadaccesoentidades) 
    { 
        $DatEvalseguridadaccesoentidades->save();
    } 
 
   public function Eliminar($idevalseguridadaccesoentidades) 
    { 
		$DatEvalseguridadaccesoentidades = new DatEvalseguridadaccesoentidades();
		$objDatEvalseguridadaccesoentidades = $DatEvalseguridadaccesoentidades->getSeguridadAccesoEntidades($idevalseguridadaccesoentidades);
        $objDatEvalseguridadaccesoentidades->delete();
    } 
}