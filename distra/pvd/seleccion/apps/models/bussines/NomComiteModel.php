<?php
class NomComiteModel extends ZendExt_Model
{
    protected $comite;

    function __construct()
    {
        $this->comite = new NomComite();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	//Función para obtener los comités de ingreso a mostrar
	public function getComite()
	{
		try {
			$r = NomComite::getComite();
			$array = array();
			foreach ($r as $v) {
				$i = count($array);
				$array[$i]->id = $v[idcomite];
				$array[$i]->text = $v[denominacion];
				$array[$i]->_parent = $v[idcomite];
				$array[$i]->expanded = false;
                if ($v[cantd] < 0) {
                    $array[$i]->icon = '/pvd/seleccion/views/images/caducado.png';
                    $array[$i]->cantd = $v[cantd];
                } else {
                    $array[$i]->icon = '/pvd/seleccion/views/images/comite.png';
                }
				$array[$i]->leaf = true;
				$array[$i]->denominacion = $v[denominacion];
				$array[$i]->descripcion = $v[descripcion];
				$array[$i]->fdesde = $v[fdesde];
				$array[$i]->fhasta = $v[fhasta];
			}
			return $array;
        } catch (Exception $e) {
            throw $e;
        }
	}

    //Función para adicionar un comité
	public function addComite($denominacion, $fdesde, $fhasta, $descripcion)
	{
		try {
			$objComite = new NomComite();
			$objComite->denominacion = $denominacion;
			$objComite->fdesde = $fdesde;
			$objComite->fhasta = $fhasta;
			$objComite->descripcion = $descripcion;
			$objComite->save();
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	//Función para modificar un comité
	public function modComite($idcomite, $denominacion, $fdesde, $fhasta, $descripcion)
	{
		try {
			$objComite = NomComite::getById($idcomite);
			$objComite->denominacion = $denominacion;
			$objComite->fdesde = $fdesde;
			$objComite->fhasta = $fhasta;
			$objComite->descripcion = $descripcion;
			$objComite->save();
			return true;
		} catch (Exception $e) {
			throw $e;
			return false;
		}
	}

	//Función para eliminar un comite de ingreso
	public function delComite($idcomite)
    {
		try {
			$obj = NomComite::getById($idcomite);
			$obj->delete();
			return true;
		} catch (Exception $e) {
            if($e->GetCode() == 23503){
                return false;
            }
		}
	}
}