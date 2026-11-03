<?php
class NomMotivoexclusionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	//Función para obtener los motivos de exclusion
	public function getMotivoExclusion($denom, $fdesde, $fhasta, $inicio, $limite)
	{
		try {
			$datos = NomMotivoexclusion::getMotivoExclusion($denom, $fdesde, $fhasta, $inicio, $limite);
            if (!$datos) {
                $datos = Array();
            } else {
				foreach ($datos as $i => $val) {
					$datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
				}
			}
            $r->datos = $datos;
            $r->cantidad = NomMotivoexclusion::cantMotivoExclusion($denom, $fdesde, $fhasta);
			return $r;
        } catch (Exception $e) {
            throw $e;
        }
	}
	
	//Función para adicionar motivos de exclusion
	public function addMotivoExclusion($denominacion, $fdesde, $fhasta, $descripcion)
	{
		try {
			$obj = new NomMotivoexclusion();
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
	
	//Función para modificar motivos de exclusion
	public function updateMotivoExclusion($idmotivoexclusion, $denominacion, $fdesde, $fhasta, $descripcion)
	{
		//try {
			$obj = NomMotivoexclusion::getById($idmotivoexclusion);
            $denom = NomMotivoexclusion::existeDenom($denominacion);
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

	//Función para eliminar motivos de exclusion
	public function deleteMotivoExclusion($idmotivoexclusion) {
		try {
			$obj = NomMotivoexclusion::getById($idmotivoexclusion);
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
        return NomMotivoexclusion::existeDenom($denominacion);
    }
}