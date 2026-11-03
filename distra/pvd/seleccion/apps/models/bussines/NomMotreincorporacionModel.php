<?php
class NomMotreincorporacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

	//Función para obtener las vías de reclutamiento
	public function getMotReincorporacion($denom, $fdesde, $fhasta, $inicio, $limite)
	{

		try {
			$datos = NomMotreincorporacion::getMotReincorporacion($denom, $fdesde, $fhasta, $inicio, $limite);
            if (!$datos) {
                $datos = Array();
            } else {
				foreach ($datos as $i => $val) {
					$datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
				}
			}
            $r->datos = $datos;
            $r->cantidad = NomMotreincorporacion::getCantMotReincorporacion($denom, $fdesde, $fhasta);
			return $r;
        } catch (Exception $e) {
            throw $e;
        }
	}

	//Función para adicionar Mot Reincorporacion
	public function addMotReincorporacion($denominacion, $fdesde, $fhasta, $descripcion)
	{
      //  die('fjghkj');
		//try {
			$obj = new NomMotreincorporacion();
			$obj->denominacion = $denominacion;
			$obj->fdesde = $fdesde;
			$obj->fhasta = $fhasta;
			$obj->descripcion = $descripcion;
          //  print_r($obj->save());die;
			$obj->save();
			return true;
		/*} catch (Exception $e) {
			return false;
		}*/
	}

	//Función para modificar vía de reclutamiento
	public function updateMotReincorporacion($idmotivoreicorporacion, $denominacion, $fdesde, $fhasta, $descripcion)
	{
		//try {
			$obj = NomMotreincorporacion::getById($idmotivoreicorporacion);
            $denom = NomMotreincorporacion::existeDenom($denominacion);
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

	//Función para eliminar
	public function deleteMotReincorporacion($idmotivoreicorporacion) {
		try {
			$obj = NomMotreincorporacion::getById($idmotivoreicorporacion);
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
        return NomMotreincorporacion::existeDenom($denominacion);
    }
}