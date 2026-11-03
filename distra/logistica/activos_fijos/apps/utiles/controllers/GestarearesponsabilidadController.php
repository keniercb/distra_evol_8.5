<?php

/**
 * Created by JetBrains PhpStorm.
 * User: adrian
 * Date: 4/09/13
 * Time: 9:48
 * To change this template use File | Settings | File Templates.
 */
class GestarearesponsabilidadController extends ZendExt_Controller_Secure
{

    private $model;

    function init()
    {
        $this->model = new GestarearesponsabilidadModel();
        parent::init();
    }

    function gestarearesponsabilidadAction()
    {
        $this->render();
    }

    public function getEntidadesDelDominioAction()
    {
        $nodo = $this->_request->getPost('node');
        $nodo = ($nodo == -1) ? 0 : ($nodo);
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idestructuracomun = $nodo;
        $dominios = $security->getDomain($idestructuracomun);


        //$composicion = ServiciosEstructuraComposicionHelper::__init();
        //$datos = $composicion->getEntidadesByDominio($this->global->Perfil->iddominio);


        if (count($dominios)) {
            echo json_encode($dominios);
        } else {
            echo json_encode(array());
        }
    }

    public function cargarcomboareaAction()
    {
        try {
            $global = ZendExt_GlobalConcept::getInstance();
            $ent = $this->integrator->metadatos->DameEstructura($global->Estructura->idestructura);

            $denominacion = $ent[0]->denominacion; //$ent[0]->text;
            $nodo = $this->_request->getPost('node');
            $soloEntidades = ($this->_request->getPost('soloEntidades')) ?
                $this->_request->getPost('soloEntidades') : false;
            //$soloEntidades = true;//---------aki

            $nodo = ($nodo == -1) ? 0 : ($nodo);
            $datos = $this->model->getAreaById(
                $nodo, $global->Estructura->idestructura, $soloEntidades
            );


            foreach ($datos as &$value) {
                $value['entidad'] = $denominacion; //$est->denominacion;
                $value['codigoentidad'] = $ent[0]->codigo;
                $value['codigo'] = $value['DatEstructuraop'][0]['codigo'];
                if ($this->_request->getPost('conCheck') && $this->_request->getPost('conCheck') != -1) {
                    if ($this->_request->getPost('marcaHijos') != -1) {
                        $value['checked'] = true;
                    } else {
                        $arraux = json_decode(
                            stripcslashes(
                                $this->_request->getPost('nodosSeleccionados')
                            )
                        );
                        if ($this->_request->getPost('nodosSeleccionados')
                            && count($arraux) > 0
                            && in_array($value['id'], $arraux)
                        ) {
                            $value['checked'] = true;
                        } else {
                            $value['checked'] = false;
                        }
                    }
                }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo $e;
        }
    }

    /**
     * Funcion para cargar las areas de una entidad
     */
    public function cargarareasAction()
    {
        $params = false;
        if ($this->_request->getPost('idestructuradestino')) {
            $params['idestructuradestino'] = $this->_request->getPost('idestructuradestino');
        }
        $datos = $this->model->getAreasResponsabilidad($params);
        $this->datos = $datos['depositos'];
        $this->cantidad = count($datos['depositos']);

        echo json_encode(array(
            'success' => true,
            'datos' => $datos['depositos'],
            'cantidad' => count($datos['depositos'])
        ));
    }
    public function cargarareassinregistroAction()
    {  
        $datos = $this->model->getAreasSinregistro();
        $this->datos = $datos['depositos'];
        $this->cantidad = count($datos['depositos']);
        $this->cantidad1 = $datos['datos'];
        echo json_encode(array(
            'success' => true,
            'datos' => $datos['depositos']['datos'],
            'cantidad' => count($datos['depositos']['datos'])


        ));
    }
    
}
