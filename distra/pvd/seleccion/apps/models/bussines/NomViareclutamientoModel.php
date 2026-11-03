<?php
class NomViareclutamientoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	//Función para obtener las vías de reclutamiento
	public function getViasReclutamiento($denom, $fdesde, $fhasta, $inicio, $limite)
	{
		try {
			$datos = NomViareclutamiento::getViasReclutamientoAll($denom, $fdesde, $fhasta, $inicio, $limite);
            if (!$datos) {
                $datos = Array();
            }
            $r->datos = $datos;
            $r->cantidad = NomViareclutamiento::cantViasReclutamientoAll($denom, $fdesde, $fhasta);
			return $r;
        } catch (Exception $e) {
            throw $e;
        }
	}

	//Función para obtener las vías de reclutamiento activas
	public function getViasReclutamientoActivas()
	{
		try {
			$datos = NomViareclutamiento::getViasReclutamientoActivas();
			foreach ($datos as $i => $val) {
				$datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
			}
			return $datos;
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	//Función para adicionar vía de reclutamiento
	public function addVia($denominacion, $fdesde, $fhasta, $descripcion)
	{
		try {
			$obj = new NomViareclutamiento();
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
	
	//Función para modificar vía de reclutamiento
	public function modVia($idviareclutamiento, $denominacion, $fdesde, $fhasta, $descripcion)
	{
		//try {
			$obj = NomViareclutamiento::getById($idviareclutamiento);
            $denom = NomViareclutamiento::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {//print_r($fhasta);die;
                $obj->denominacion = $denominacion;
                $obj->fdesde = $fdesde;
                if ($fhasta) {$obj->fhasta = $fhasta;}
                $obj->descripcion = $descripcion;
                $obj->save();
                return true;
            } else {return false;}

		/*} catch (Exception $e) {
			return false;
		}*/
	}

	//Función para eliminar vía de reclutamiento
	public function deleteVia($idviareclutamiento) {
		try {
			$obj = NomViareclutamiento::getById($idviareclutamiento);
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
        return NomViareclutamiento::existeDenom($denominacion);
    }
}