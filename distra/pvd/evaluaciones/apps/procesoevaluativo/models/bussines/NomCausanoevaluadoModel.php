<?php

class NomCausanoevaluadoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    public function getCausaNoEvalaluados(){
        $causa=new NomCausanoevaluado();
        return $causa->GetTodos();
    }
    public function getCantCausaNoEvalaluados($filtro){
        $causa=new NomCausanoevaluado();
        return $causa->GetCantTotal($filtro);
    }
	
	public function Insertar(NomCausanoevaluado $NomCausanoevaluado)
    {
            $NomCausanoevaluado->save();
    }

   public function Actualizar(NomCausanoevaluado $NomCausanoevaluado)
    {
            $NomCausanoevaluado->save();
    }

    public function Eliminar($idcausanoevaluado)
    {
		try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomCausanoevaluado')
				->where('idcausanoevaluado = ?', $idcausanoevaluado)
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
        return NomCausanoevaluado :: ExisteDenomRecon($denom);
    }

    public function RecomendacionEnUso($id)
    {
       $valores = NomCausanoevaluado :: RecomendacionEnUso($id);
       if(!$valores)
            return true;
       return false;
    }

}