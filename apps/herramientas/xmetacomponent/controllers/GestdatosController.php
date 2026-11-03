<?php

/**
 * GestplandionyController
 * Controlador para gestionar los planes
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificaci�n
 * @ subpackage Planificaci�n
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class GestdatosController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Dionisdel Ponce Santana
     * */
    function init()
    {
        parent::init();
    }

    /**
     * funcion gestplandiony()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function gestdatosAction()
    {
        $this->render();
    }

    /**
     * funcion adicionar()
     * Para adicionar elemento
     *
     * @author Dionisdel Ponce Santana
     */
    public function adicionarAction()
    {
        /**
         * Params:
         * @ idindplan            identificador del indicador a planificar
         * @ todos los parametros dinamicos a identificar para persistir
         * con el active record
         */
        //Si viene id es modificar, sino adicionar
        $idindplan = $this->_request->getPost('idindplan');
        // Devuelvo para la UI la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = 'El elemento ha sido ' . (($idindplan) ? 'modificado'
                : 'adicionado') .
            ' satisfactoriamente.';
        echo json_encode($dat);
    }

    /**
     * funcion eliminar()
     * Para eliminar elemento
     *
     * @author Dionisdel Ponce Santana
     */
    public function eliminarAction()
    {
        /**
         * Params:
         * @ idindplan            identificador del indicador a eliminar
         * @ todos los parametros dinamicos a identificar para persistir
         * con el active record
         */
        $idindplan = $this->_request->getPost('idindplan');
        // Devuelvo para la UI la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = 'El elemento ha sido eliminado satisfactoriamente.';
        echo json_encode($dat);
    }

    /**
     * funcion cargargrid()
     * Para el grid de la planificacion
     *
     * @author Dionisdel Ponce Santana
     */
    public function cargargridAction()
    {
        /**
         * Params:
         * @ start        Inicio de los records
         * @ limit        fin de los records para el paginado
         */
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        // Cantidad total de record en BD
        $dat = new stdClass();
        $dat->totalRec = 3;
        $dat->data [] = array('idindplan' => '1', 'denom' => 'IndPlan_1',
                              'fecha'     => '12/01/02');
        $dat->data [] = array('idindplan' => '2', 'denom' => 'IndPlan_2',
                              'fecha'     => '12/01/02');
        $dat->data [] = array('idindplan' => '3', 'denom' => 'IndPlan_3',
                              'fecha'     => '12/01/02');
        echo json_encode($dat);
    }

    public function cargarconfgridAction()
    {
        /**
         * Params:
         * @ idtipomodelo            identificador del tipo del
         * modelo seleccionado
         */
        $idtipomodelo = $this->_request->getPost('idtipo');
        // Si tiene una configuracion asociada ()?true:false
        $dat = new stdClass();
        $dat->cf = true;
        // Configuracion para mapear el reader en la UI
        $dat->rd [] = array('name' => 'denom');
        $dat->rd [] = array('name' => 'fecha');
        // Configuracion de cada columna para el column model segun la
        //config dinamica de cada campo en BD
        $dat->cm [] = array('header'    => 'Denominacion',
                            'width'     => 100,
                            'dataIndex' => 'denom',
                            'value'     => "textfield",
                            'editor'    => array("xtype"      => 'textfield',
                                                 'allowBlank' => false
                            )
        );
        $dat->cm [] = array('header'    => 'Fecha',
                            'width'     => 100,
                            'dataIndex' => 'fecha',
                            'value'     => "datefield",
                            'editor'    => array("xtype"  => 'datefield',
                                                 'format' => 'Y-m-d'
                            )
        );
        $dat->cm [] = array('header'    => 'Sexo',
                            'width'     => 100,
                            'dataIndex' => 'sexo',
                            'value'     => 'combo',
                            'editor'    =>
                                array("xtype"  => 'combo',
                                      'valueField'    => 'sexo',
                                     'displayField'  => 'denominacion',
                                     'store'         =>
                                         array('url'      => 'cargarcombo',
                                             'autoLoad' => true),
                                             'tabla'         => 'prueba',
                                             'triggerAction' => 'all',
                                             'readOnly'      => true,
                                             'mode'          => 'local',
                                             'emptyText'     => 'Seleccione ...'
                            )
        );
        // Devuelvo para la UI la configuracion obtenida
        echo json_encode($dat);
    }

    /**
     * funcion cargarformmodificar()
     * Para cargar los datos de un elemento a modificar
     *
     * @author Dionisdel Ponce Santana
     */
    public function cargarformmodificarAction()
    {
        /**
         * Params:
         * @ idindplan            identificador del indicador a eliminar
         */
        $idindplan = $this->_request->getPost('idindplan');
        // Devuelvo para la UI el elemento
        $dat->totalRec = 1;
        $dat->data [] = array('idindplan' => '1',
                              'denom'     => 'IndPlan_1',
                              'fecha'     => '12/01/02'
        );
        echo json_encode($dat);
    }

    /**
     * funcion cargartreeplanes()
     * Para obtener el tree de planes
     *
     * @author Dionisdel Ponce Santana
     */
    public function cargartreeplanesAction()
    {
        /**
         * Params:
         * @ node            identificador del elemento a cargar
         * Si:
         * 0 Nodo raiz    -> Devuelvo los planes existentes
         * 1 Plan        -> Devuelvo los modelos de ese plan
         */
        $node = $this->_request->getPost('node');
        //Devuelvo el elemento consultado
        if ($node == 0) {
            //$dat [] = array('id' => 1,'text' => "Plan 1",'draggable'=> false,
            //'expanded'=>true,'tipo' => 1);
            //$dat [] = array('id' => 2,'text' => "Plan 2",'draggable'=> false,
            //'expanded'=>true,'tipo' => 1);
            $dat [] = array('id'        => 11,
                            'text'      => "Modelo 1.1",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
            $dat [] = array('id'        => 12,
                            'text'      => "Modelo 1.2",
                            'draggable' => false, 'leaf' => true,
                            'tipo'      => 2
            );
            $dat [] = array('id'        => 21,
                            'text'      => "Modelo 2.1",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
            $dat [] = array('id'        => 22,
                            'text'      => "Modelo 2.2",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
        }
        if ($node == 1) {
            $dat [] = array('id'        => 11,
                            'text'      => "Modelo 1.1",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
            $dat [] = array('id'        => 12,
                            'text'      => "Modelo 1.2",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
        }
        if ($node == 2) {
            $dat [] = array('id'        => 21,
                            'text'      => "Modelo 2.1",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
            $dat [] = array('id'        => 22,
                            'text'      => "Modelo 2.2",
                            'draggable' => false,
                            'leaf'      => true,
                            'tipo'      => 2
            );
        }
        die(json_encode($dat));
    }

    /**
     * funcion cargarcombo()
     * Para cargar los datos de un nomenclador
     *
     * @author Dionisdel Ponce Santana
     */
    public function cargarcomboAction()
    {
        /**
         * Params:
         * @ idtabla        identificador del concepto a cargar
         */
        $idtabla = $this->_request->getPost('idtabla');
        // Devuelvo para la UI los elementos
        $dat = new stdClass();
        $dat->total = 2;
        $dat->data [] = array('sexo' => '1', 'denominacion' => 'Elemento 1');
        $dat->data [] = array('sexo' => '2', 'denominacion' => 'Elemento 2');
        echo json_encode($dat);
    }

}