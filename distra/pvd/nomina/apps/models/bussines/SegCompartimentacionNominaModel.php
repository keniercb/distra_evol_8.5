<?php

class SegCompartimentacionNominaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function SegCompartimentacionNominaModel() {
        parent::ZendExt_Model();
    }

    public function Adicionar($idcargo){
		$o = new SegCompartimentacionNomina();
		$o->idcargo = $idcargo;
		$o->save();
		$otnModel = new SegCompartimentacionCargoPorTipoNominaModel();
		$otnModel->Adicionar($o->idcompartimentacionnomina);
		return true;
	}

	public function buscarcategorias($idcargo){
		$o =SegCompartcargocategoria::buscarcategorias($idcargo);

		return $o;
	}
    public function AddCategoria($idcategoria,$idcargo){
        $cantidad = SegCompartcargocategoria::existe($idcategoria,$idcargo);

        if(count($cantidad) == 0){
            $o = new SegCompartcargocategoria();
            $o->idcargo = $idcargo;
            $o->idcategoria = $idcategoria;
            $o->save();
            return 1;
        }else{
            return 2;
        }


	}

	public function Eliminar($idcompartimentacionnomina){
        try {
            $o = Doctrine::getTable('SegCompartimentacionNomina')->find($idcompartimentacionnomina);
            $o->delete();
            return 1;
        }catch (Exception $e){
            if($e->getCode() == 23503)//Code for foreignKeyViolation
                return 0;

        }
	}

    public function DelCategoria($idcompartcargocategoria){
        try {
            $o = Doctrine::getTable('SegCompartCargoCategoria')->find($idcompartcargocategoria);
            $o->delete();
            return 1;
        }catch (Exception $e){
            if($e->getCode() == 23503)//Code for foreignKeyViolation
                return 0;

        }
	}
    
    
}
