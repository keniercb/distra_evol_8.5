<?php

class MultientidadModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function cargarEntidades($node)
    {
        //****OJO VER CON RACIEL QUE EL SERVICIO NO FUNCIONA CUANDO SE LE PASA LA SUBORDINACION 3 QUE ES LA DE PLANIFICACION, Y SOLO CUANDO NO SE PASA NADA...
        $estructuras = $this->integrator->metadatos->BuscarHijoPorSubordinacion($node, 1); //DEBERIA SER (0,3)
        //$pruebaa=$this->integrator->metadatos->BuscarPadrePorSubordinacion();//****OJO VER CON RACIEL QUE ESTE TAMPOCO FUNCIONA CUANDO SE LE PASA LA SUBORDINACION
        //print_r($estructuras);die;
        for ($i = 0; $i < count($estructuras); $i++) {
            $dat[$i]['id'] = $estructuras[$i]->idestructura;; //$estructuras[$i]->idestructura;
            $dat[$i]['text'] = $estructuras[$i]->denominacion;
            $dat[$i]['draggable'] = false; //duda, para qu� es esto
            $hijos = $this->integrator->metadatos->BuscarHijoPorSubordinacion(
                $estructuras[$i]->idestructura
            ); //900000098//100000003//$estructuras[$i]->idestructura
            $padref = $hijos[0]->NomFilaestruc['hijo']['idpadre'];

            if ($padref == $estructuras[$i]->idestructura) {
                $dat[$i]['leaf'] = false;
            } else {
                $dat[$i]['leaf'] = true;
            }
        }

        return $dat;
    }

    public function cargarEntidadesIntegracion($node, $checked = 0)
    {
        $idEstructura = ($node) ? $node : 0;
        $dominios = array();
        if ($idEstructura == 0) {
            $security = ZendExt_Aspect_Security_Sgis::getInstance();
            $dominios = $security->getDomain($idEstructura);
        } else {
            $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                0, $idEstructura, $checked, 0, 0
            ); //iddominio,idestrc,checked
        }
        return $dominios;
    }

    public function getEntidadesDecendientesIntegracion($identidad, $integrator = null)
    {
        //temporal poner este metodo en MultientidadModel y replicar los cambios
        if (empty($integrator)) {
            $integrator = ZendExt_IoC::getInstance();
        }
        $dominios = $integrator->metadatos->buscarHijosEstructuras(0, $identidad, 0, 0, 0);
        $entidades_hijas = array();
        foreach ($dominios as $entidad_hija) {
            if ($entidad_hija['leaf'] == true) {
                $entidades_hijas[] = $entidad_hija['id'];
            } else {

                $entidades_hijas[] = $entidad_hija['id'];
                $entidades_hijas = array_merge(
                    $entidades_hijas,
                    MultientidadModel::getEntidadesDecendientesIntegracion($entidad_hija['id'], $integrator)
                );
            }
        }
        return $entidades_hijas;
    }


    public function getArrayEspecialidades($array_identidad, $porEntidad_assoc = 0)
    {
        $datos_entidad = array();
        //print_r($array_identidad.'55555');die;
        if ($array_identidad [0] != null) {
            
            $datos_entidad = $this->integrator->metadatos->ObtenerDatosEstructuraPorArrayID($array_identidad);
        }
        //print_r($porEntidad_assoc);die;
        $array_idespecialidades = array();
        $array_paralelo_entesp = array();
        if (is_array($datos_entidad)) {
            if ($porEntidad_assoc == '1') {
                foreach ($datos_entidad  as $valor_entidad) {
                    $array_idespecialidades['identidad' . $valor_entidad->idestructura]
                        = $valor_entidad->idespecialidad;
                }
            } else {
                if ($porEntidad_assoc == '3') {
                    foreach ($datos_entidad as $valor_entidad) {
                        $array_idespecialidades[] = $valor_entidad[0]->idespecialidad;
                        $array_paralelo_entesp['identidad'][] = $valor_entidad[0]->idestructura;
                        $array_paralelo_entesp['idespecialidad'][] = $valor_entidad[0]->idespecialidad;
                    }
                    return $array_paralelo_entesp;
                } else {
                    foreach ($datos_entidad as $valor_entidad) {
                        $array_idespecialidades[] = $valor_entidad[0]->idespecialidad;
                    }
                }
            }
        }
        print_r($array_idespecialidades);die;
        return $array_idespecialidades;
    }


    public function buscarEntidadesHijas($identidad)
    {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        //print_r($dominios);
        $entidades_hijas = array();
        foreach ($dominios as $entidad_hija) {

            if ($entidad_hija->leaf == true) {
                $entidades_hijas[] = $entidad_hija->idestructura;
            } else {

                $entidades_hijas = array_merge(
                    $entidades_hijas, self::buscarEntidadesHijas($entidad_hija->idestructura)
                );
            }

        }
        //print_r($entidades_hijas);
        return $entidades_hijas;
    }


}
