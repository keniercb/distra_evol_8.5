<?php
class DatProcesonotifModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatProcesonotif $DatProcesonotif) {
		$DatProcesonotif->save ();
	}
	
	public function Actualizar(DatProcesonotif $DatProcesonotif) {
		$DatProcesonotif->save ();
	}
		
	public function Eliminar($idprocesonotif) {		
        $DatProcesonotif =$this->getPersonaEvaluacion($idprocesonotif);
		$DatProcesonotif->delete ();
	}

    public function Modificar($asunto, $mensaje, $idprocesonotif, $usuario, $pass){
        $query = Doctrine_Query::create()
            ->update()
            ->from('DatProcesonotif')
            ->set('asunto', '?',$asunto )
            ->set('mensaje', '?', $mensaje)
            ->set('remitente', '?', $usuario)
            ->set('contrasenna', '?', $pass)
            ->whereIn('idprocesonotif',$idprocesonotif);
        $query->execute();
    }
    public function getDatosProceso($iddefprocesoevaluativo){
        $query = Doctrine_Query::create()
            ->from ('DatProcesonotif')
            ->where('iddefprocesoevaluativo = ?',$iddefprocesoevaluativo);
        $arr = $query->fetchArray();
        return $arr;
    }

}

