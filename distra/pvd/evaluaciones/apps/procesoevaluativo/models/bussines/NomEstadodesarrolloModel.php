<?php
class NomEstadodesarrolloModel extends ZendExt_Model
 {
   public function setUp()
    {
        parent::ZendExt_Model();
    }

   public function Insertar(NomEstadodesarrollo $NomEstadodesarrollo)
    {
            $NomEstadodesarrollo->save();
    }

   public function Actualizar(NomEstadodesarrollo $NomEstadodesarrollo)
    {
            $NomEstadodesarrollo->save();
    }

    public function Eliminar($idestadodesarrollo)
    {
		try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomEstadodesarrollo')
				->where('idestadodesarrollo = ?', $idestadodesarrollo)
				->execute();
			return $r;
		}
        catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                $r->exception = 1;
                return $r;
            }else{
                return (json_encode($e->getMessage()));
            }
        }
    } 

    public function existeDenominacion($denom){
        return NomEstadodesarrollo :: ExisteDenomRecon($denom);
    }

    public function RecomendacionEnUso($id)
    {
       $valores = NomEstadodesarrollo :: RecomendacionEnUso($id);
       if(!$valores)
            return true;
       return false;
    }
 }

