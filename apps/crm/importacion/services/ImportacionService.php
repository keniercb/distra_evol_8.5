<?php

/**
 * DatosMaestrosComunicationInterface
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema datos maestros.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa martínez
 * @copyright (c) 2015, XETID
 * @version       1.0
 */

//$classbase = realpath(dirname(__FILE__))
//    . '/../../../configuracion/clientesyproveedores/models/domain/generated/BaseNomClienteproveedor.php';
//$class = realpath(dirname(__FILE__))
//    . '/../../../configuracion/clientesyproveedores/models/domain/NomClienteproveedor.php';
include_once realpath(dirname(__FILE__))
    . '/../../../configuracion/clientesyproveedores/models/domain/generated/BaseNomClienteproveedor.php';;
include_once realpath(dirname(__FILE__))
    . '/../../../configuracion/clientesyproveedores/models/domain/NomClienteproveedor.php';
include_once realpath(dirname(__FILE__))
    . '/../../../logistica/utiles/maestroproductos/models/domain/generated/BaseNomIndicador.php';
include_once realpath(dirname(__FILE__))
    . '/../../../logistica/utiles/maestroproductos/models/domain/NomIndicador.php';

class ImportacionService extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->incluirDependencias();
        $this->_demanda = new DemandaDService();
        $this->_solicitudestado = new SolicitudOfertaEstadoDService();
    }

    public function guardarDemanda($parametros)
    {
        try {
//            $parametros=array(
//                'iddocbalanceo'=>'12',
//                'clientes'=>array(
//                    '990000000026'=>array(
//                        'idcliente'=>'990000000026',
//                        'productos'=>array(
//                            array(
//                                'idindicador'=>'45273',
//                                'cantidad'=>'3',
//                                'idpedido'=>'8'
//                            ),
//                            array(
//                                'idindicador'=>'46411',
//                                'cantidad'=>'1',
//                                'idpedido'=>'9'
//                            ),
//                            array(
//                                'idindicador'=>'133662',
//                                'cantidad'=>'20',
//                                'idpedido'=>'8'
//                            )
//                        )
//                )
//            ));
//            print('/*iniciando*/');
            $result=array(); $pedidosencontrados=array();
            foreach ($parametros['clientes'] as $cliente) {
//                print('/*cliente:'.$cliente['idcliente'].'*/');
                $nomcliente = Doctrine::getTable('NomClienteproveedor')
                    ->find($cliente['idcliente']);
                $productosordenados=array();
                foreach ($cliente['productos'] as &$prod) {
                    if(!array_key_exists($prod['idpedido'], $result)){
                        $result[$prod['idpedido']]=array();
                    }

                    $nomindicador = Doctrine::getTable('NomIndicador')
                        ->find($prod['idindicador']);
                    $prod['denominacion'] = $nomindicador->denominacion;
                    $prod['codigo'] = $nomindicador->codigo;
                    $prod['tipo'] = $nomindicador->tipo;
                    if(!$prod['idlinea'])$prod['idlinea']=$nomindicador->idnaturaleza;
                    if(!$productosordenados[$prod['idlinea']]){
                        $productosordenados[$prod['idlinea']]=array($prod);
                    }else{
                        $productosordenados[$prod['idlinea']][]=$prod;
                    }
                }
                $sector=$nomcliente->idsector;
                if(!$sector){
                    $aux=Doctrine::getTable('NomSector')->findByDql('denominacion=?', array('Exportación'));
                    if(count($aux))$sector=$aux[0]->idsector;
                }
//                print_r($productosordenados);die;
                foreach ($productosordenados as $i=>$value){
                    $iddemanda=$this->_demanda->adicionarDemanda(array(
                        'idclienteproveedor' => $cliente['idcliente'],
                        'nombre' => $nomcliente->nombre,
                        'idsector' => $sector, //falta exportacion si no
                        'fechacreada' => date('d/m/Y'),
                        'numero' => $this->_demanda->generarConsecutivoAño(3),
                        'idlinea' => $i, //$cliente['productos'][0]['idlinea'],
                        'cliente'=> 3,
                        'idarea'=>$this->global->Estructura->idestructura,
                        'idbalanceo'=>$parametros['iddocbalanceo'],
                        'productosservicios' => array('nuevos'=>$value)
                    ));
                    if($iddemanda){
                        foreach ($value as $v){
                            if(!array_key_exists($v['idpedido'], $result)){
                                $result[$v['idpedido']]=array();
                            }
                            if(!in_array($iddemanda, $result[$v['idpedido']])){
                                $result[$v['idpedido']][]=$iddemanda;
                            }
                        }
                        $aprobado=NomEstado::getEstadoByAction('aprobado');
                        if($aprobado){
                            $this->_solicitudestado->cambiarSolicitudEstado(array(
                                'idsolicitud'=>$iddemanda, 'idestado'=>$aprobado
                            ));
                        }
                    }
                }

            }
            return array('success'=> true, 'pedidos'=>$result);
        }catch (Exception $e) {
            return array('code'=> $e->getCode(), 'msg'=> $e->getMessage(),
                'success'=> false);
        }
    }

    public function incluirDependencias()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];

        //Direccion del fichero de configuracion
        $config_file = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/crm/config.php';

        if (!file_exists(
            $config_file
        )
        ) { //Si no existe el fichero de configuracion
            //Se dispara una excepcion
            throw new Exception('El fichero de configuracion no existe');
        } elseif (!is_readable($config_file)) { //Si no se puede leer
            //Se dispara una excepcion
            throw new Exception(
                'No se pudo leer el fichero de configuracion. Acceso denegado.'
            );
        } else { //Si existe el fichero y se puede leer
            //Se inicializa la variable de configuración
            $config = array();

            //Se incluye el fichero
            include_once($config_file);

            if (!isset($config['include_path'])) {
                throw new Exception(
                    'El framework no esta configurado correctamente.'
                );
            }

            //Se inicializa el include path de php a partir de la variable de configuracion
            set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
//            set_include_path($config['include_path']);

            //Se inicia la carga automatica de clases y ficheros
            $loader_file = 'Zend/Loader.php';
            if (!@include_once($loader_file)) {
                throw new Exception(
                    'El framework no esta configurado correctamente.'
                );
            }
        }
    }

}