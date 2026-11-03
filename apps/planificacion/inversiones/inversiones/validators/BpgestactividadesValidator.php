<?php

/* @utor:Pedro Enrique Rojas
 */

class BpgestactividadesValidator
{

    public $post = array();

    public function BpgestactividadesValidator()
    {
        $this->post = $_POST;
    }

    public function validarActividadAsociadaEntidad()
    {
        return true;
    }

	 public function validarExistenciaCodigoActividad()
    {


        $codigo = $this->post['codigo'];
        $idpadre = $this->post['idpadre'];
        $idactividad = $this->post['idactividad'];
        
        $idactorigen = $this->post['idactorigen'];


        $global = ZendExt_GlobalConcept::getInstance();
        $this->nomenclador = new ZendExt_Nomencladores_ADT ();
        $especialidades = $this->nomenclador->selectParam(
            'nom_especialidad', array('codespecialidad'), 0, 0,
            "idespecialidad = " . $global->Estructura->idespecialidad
        );
        $codigoespecialidad = $especialidades[0]['codespecialidad'];
		

        if ($idactividad != '' && $idactorigen == null) {

            
            $actividad = Doctrine::getTable('NomActividad')->find($idactividad);
            if ($actividad->idpadre . ' ' == $idactividad . ' ') {
            
                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividadpadre = Doctrine::getTable('NomActividad')->find($idpadre);
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
            return (NomActividad::existeCodigoAlModificar($idactividad, $codigo) == false);
        } elseif ($idactorigen != '') {

           
            $actividad_origen = Doctrine::getTable('NomActividad')->find($idactorigen);
            if ($actividad_origen->idpadre . " " == $idactorigen . " ") {
                
                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividad_padre = Doctrine::getTable('NomActividad')->find($actividad_origen->idpadre);
                $codigo = $actividad_padre->codigo . "" . $codigo;
            }
        } elseif ($idactividad == '') {

            
            if ($idpadre == '') {
             
                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
              
                $actividadpadre = Doctrine::getTable('NomActividad')->find($idpadre);
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
        }
        return (NomActividad::existeCodigo($codigo) == false);
    }
   /* public function validarExistenciaCodigoActividad()
    {


        $codigo = $this->post['codigo'];
        $idpadre = $this->post['idpadre'];
        $idactividad = $this->post['idactividad'];
		$idespecialista = $this->post['idespecialista'];
        /*         * Se captura el idorigen por si esta duplicando la actividad */
       /* $idactorigen = $this->post['idactorigen'];


        $global =  Zendext_IoC::getInstance();
        $this->nomenclador = new ZendExt_Nomencladores_ADT ();
      /*  $especialidades = $this->nomenclador->selectParam(
            'nom_especialidad', array('codespecialidad'), 0, 0,
            "idespecialidad = " . $global->Estructura->idespecialidad
        );*/
		/*$array = Array();
		//$array[0] = $idespecialista;
	   // $especialidades = $this->nomenclador->selectParam('nom_especialidad', array('codespecialidad'), 0, 0, "idespecialidad = " . $params['idespecialidad']);
		$especialidades = $global->Estructura->DameEspecialidadesPorArregloId($array);print_r($especialidades);die;
		$params['codigoespecialidad'] = $especialidades[0]['codigo'];
        $codigoespecialidad = $especialidades[0]['codespecialidad'];


        if ($idactividad != '' && $idactorigen == null) {

            /* Modificar */
          /*  $actividad = Doctrine::getTable('NomActividad')->find($idactividad);
            if ($actividad->idpadre . ' ' == $idactividad . ' ') {
                /* Modificar actividad del grupo de la actividad(1er nivel) */
              /*  $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividadpadre = Doctrine::getTable('NomActividad')->find($idpadre);
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
            return (NomActividad::existeCodigoAlModificar($idactividad, $codigo) == false);
        } elseif ($idactorigen != '') {

            /* Duplicar */
           /* $actividad_origen = Doctrine::getTable('NomActividad')->find($idactorigen);
            if ($actividad_origen->idpadre . " " == $idactorigen . " ") {
                /* Duplicar actividad del grupo de la actividad (1er nivel) */
            /*    $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividad_padre = Doctrine::getTable('NomActividad')->find($actividad_origen->idpadre);
                $codigo = $actividad_padre->codigo . "" . $codigo;
            }
        } elseif ($idactividad == '') {

            /* Adicionar */
           /* if ($idpadre == '') {
                /* Adicionar sub actividad */
             /*   $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                /* Adicionar actividad del grupo de la actividad(1er nivel) */
             /*   $actividadpadre = Doctrine::getTable('NomActividad')->find($idpadre);
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
        }
        return (NomActividad::existeCodigo($codigo) == false);
    }*/

    public function validarActividadAprobada()
    {
        $array_actividades = json_decode(stripslashes($this->post['actividades']));
        if ($this->post['estado'] == '0' || $this->post['esrector'] == 'true') {
            return true;
        }
        if (is_array($array_actividades)) {
            foreach ($array_actividades as $valor_actividad) {
                $objactividad = Doctrine::getTable('NomActividad')->find($valor_actividad->idactividad);
                if ($objactividad->idaprobacion < 3) {
                    return false;
                }
            }
        }
        return true;
    }

    public function validarActividadNormada()
    {
        $array_actividades = json_decode(stripslashes($this->post['actividades']));
        $idaprobacion = $this->post['idaprobacion'];
        $ultimonivel = $this->post['ultimonivel'];
        if ($idaprobacion == '1') {
            return true;
        }
        if (is_array($array_actividades)) {
            foreach ($array_actividades as $valor_act) {
                if ($valor_act->nivel == $ultimonivel) {
                    $objactividad = Doctrine::getTable('NomActividad')->find($valor_act->idactividad);
                    if ($objactividad->normada == '0') {
                        return false;
                    }
                } else {
                    //buscar que todos sus hijos del ultimo nivel esten normados
                    if (NomActividad::todaDecendenciaUltimoNivNormada(array($valor_act, $ultimonivel)) == false) {
                        return true;
                    }
                }
            }
        }
        return true;
    }


    /* public function validarActividadAsociadaEntidadPorRegla() {
      $identidad = $this->post['identidad'];
      $idactividad = $this->post['idactividad'];
      /*temporal se envia el identidad vacio por problemas en las validaiones de la IU*
      if($identidad == '')
      return false;
      return DatActividadentidad::existeActividadAsociadaAEntidadAutomatica($identidad,$idactividad)
      == null;
      } */
}

?>