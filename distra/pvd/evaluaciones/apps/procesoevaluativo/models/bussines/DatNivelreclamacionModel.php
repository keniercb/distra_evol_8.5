<?php

class DatNivelreclamacionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    
	public function Insertar(DatNivelreclamacion $DatNivelreclamacion)
    {
            $DatNivelreclamacion->save();
    }

   public function Actualizar($arrNiveles,$iddefprocesoevaluativo)
    {
		$DatNivelreclamacion = new DatNivelreclamacion();
		$cont = 0;
		foreach($arrNiveles as $key=>$nivel){	
			if($nivel->idnivelreclamacion != ''){
				  $query = Doctrine_Query::create()
					->update()
					->from('DatNivelreclamacion')
					->set('nivel', '?',$nivel->nivel)
					->set('denominacion', '?',$nivel->denominacion)
					->set('tiemporeclamacion', '?', $nivel->tiemporeclamacion)
					->set('tiemporespuesta', '?', $nivel->tiemporespuesta)
					->whereIn('idnivelreclamacion',$nivel->idnivelreclamacion);
				$query->execute();
			}
			else{
				$DatNivelreclamacion->denominacion = $nivel->denominacion;
				$DatNivelreclamacion->nivel = $nivel->nivel;
				$DatNivelreclamacion->tiemporeclamacion = $nivel->tiemporeclamacion;
				$DatNivelreclamacion->tiemporespuesta = $nivel->tiemporespuesta;
				$DatNivelreclamacion->iddefprocesoevaluativo = $iddefprocesoevaluativo;
				$cont++;
			}
		}
		if($cont>0)
		$DatNivelreclamacion->save();
    }
	public function Eliminar($idnivelreclamacion){
	try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('DatNivelreclamacion')
				->where('idnivelreclamacion = ?', $idnivelreclamacion)
				->execute();
			return $r;
		}
        catch (Exception $e){
            if($e->getCode() == 23503){
                $r->exception = 1;
                return $r;
            }else{
                return (json_encode($e->getMessage()));
            }
        }
	}
	
	public function EliminarNivelByProceso($iddefprocesoevaluativo){
		try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('DatNivelreclamacion')
				->where('iddefprocesoevaluativo = ?', $iddefprocesoevaluativo)
				->execute();
			return $r;
		}
        catch (Exception $e){
            if($e->getCode() == 23503){
                $r->exception = 1;
                return $r;
            }else{
                return (json_encode($e->getMessage()));
            }
        }
	}
	
	
}