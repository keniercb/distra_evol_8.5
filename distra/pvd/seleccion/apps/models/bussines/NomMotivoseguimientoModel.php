<?php
class NomMotivoseguimientoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	//Función para obtener los motivos de seguimiento
	public function getMotivosSeguimiento($denom, $fdesde, $fhasta, $inicio, $limite)
	{
		try {
			$datos =  NomMotivoseguimiento::getMotivosSeguimientoAll($denom, $fdesde, $fhasta, $inicio, $limite);
            if (!$datos) {
                $datos = Array();
            }
            $r->datos = $datos;
            $r->cantidad =  NomMotivoseguimiento::cantMotivosSeguimientoAll($denom, $fdesde, $fhasta);
			return $r;
        } catch (Exception $e) {
            throw $e;
        }
	}

    //Función para obtener los motivos de seguimiento activos
    public function getMotivosSeguimientoActivos()
    {
        try {
            $datos =  NomMotivoseguimiento::getMotivosSeguimientoActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }
	
	//Función para adicionar motivo de seguimiento
	public function addMotivo($denominacion, $fdesde, $fhasta, $descripcion)
	{
		try {
			$obj = new NomMotivoseguimiento();
			$obj->denominacion = $denominacion;
			$obj->fdesde = $fdesde;
			$obj->fhasta = $fhasta;
			$obj->descripcion = $descripcion;
			$obj->save();
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	//Función para modificar motivo seguimiento
	public function modMotivo($idmotivoseguimiento, $denominacion, $fdesde, $fhasta, $descripcion)
	{
		try {
			$obj =  NomMotivoseguimiento::getById($idmotivoseguimiento);
            $denom =  NomMotivoseguimiento::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->fdesde = $fdesde;
                if ($fhasta) {$obj->fhasta = $fhasta;}
                $obj->descripcion = $descripcion;
                $obj->save();
                return true;
            } else {return false;}

		} catch (Exception $e) {
			return false;
		}
	}

	//Función para eliminar motivo seguimiento
	public function deleteMotivo($idmotivoseguimiento) {
		try {
			$obj =  NomMotivoseguimiento::getById($idmotivoseguimiento);
			$obj->delete();
			return true;
		} catch (Exception $e) {
            if($e->GetCode() == 23503){
                return false;
            }
		}
	}

    public function existeDenom($denominacion)
    {
        return  NomMotivoseguimiento::existeDenom($denominacion);
    }
}
