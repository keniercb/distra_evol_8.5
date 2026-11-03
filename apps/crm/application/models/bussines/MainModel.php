<?php

/**
 * MainModel
 *
 * Esta es la clase modelo que contiene todo el negocio referente a la aplicación
 * de forma general
 *
 * @package        ERP-PCRM
 * @category       Model
 * @author         Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c)  2014, XETID
 * @version        1.0
 */
class MainModel extends ZendExt_Model
{
    private $segServiceInterface;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->segServiceInterface = new SeguridadComunicationInterface();
    }

    /**
     * Sincroniza los modulos de la app con funcionalidades de seguridad
     * de acuerdo a los permisos que tenga el usuario sobre estas
     *
     * @param array $post Arreglo con los datos de la peticion
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     */
    public function securitySync($post)
    {
        $modules = json_decode(stripslashes($post['modules']));
        $idusuario = !empty($post['idusuario']) ? $post['idusuario'] : $this->global->Perfil->idusuario;

        if (!empty($modules)) {
            $navitems = array();

            foreach ($modules as $module) {

                if (!empty($module->parent) && !array_key_exists($module->parent->id, $navitems)) {
                    $item = array('title' => $module->parent->name, 'hidden' => $module->parent->disabled,);
                    if ($module->parent->iconCls) {
                        $item['iconCls'] = $module->parent->iconCls;
                    }
                    $navitems[$module->parent->id] = $item;
                }

//                print_r($module);die;
                if (!empty($module->fullpath)) {
                    $funct = $this->segServiceInterface->getNonVisibleFunctionlatities($module->fullpath);
                    if(!isset($navitems[$module->parent->id]['items'])){
                        $navitems[$module->parent->id]['items'] = array();
                    }

                    if (count($funct)) {

                        $node = $this->getNode($funct, $module, $idusuario);

                        $navitems[$module->parent->id]['items'][] = $node;
                    }
                }
            }

            return array_values($navitems);
        }

    }

    private function getNode($funct, $module, $idusuario)
    {
        $description = $module->description ? $module->description : $funct[0]['descripcion'];
        $check = ConfAccesoDirecto::GetByCondition(
            'idusuario = ? AND idfuncionalidad = ?', array($idusuario, $funct[0]['idfuncionalidad']), true
        );
        $autorun = count($check) > 0;
        $node = array(
            'text'            => $module->name ? $module->name : $funct[0]['text'],
            'namespace'       => $module->namespace,
            'moduleId'        => $module->id,
            'disabled'        => $module->disabled,
            'description'     => $description,
            'autorun'         => $autorun,
            'idfunctionatity' => $funct[0]['idfuncionalidad'],
            'reference' => $funct[0]['referencia'],
        );

        if ($module->iconCls) {
            $node['iconCls'] = $module->iconCls;
        } else {
            if (!empty($funct[0]['icono'])) {
                $node['iconCls'] = $funct[0]['icono'];
            }
        }

        return $node;
    }

    /**
     * Guarda en la base de datos los accesos directos a los modulos del sistema CRM
     *
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     *
     * @param array $post Arreglo con los datos del acceso directo
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function saveShortcuts($post)
    {
        $response = array('errors' => array(), 'success' => array());

        $idusuario = !empty($post['idusuario']) ? $post['idusuario'] : $this->global->Perfil->idusuario;

        $flagDel = true;
        if (!empty($post['del'])) {
            $response = $this->eraseDirectAccess($post, $idusuario, $response);
        }


        if (!empty($post['add'])) {
            $toAdd = json_decode($post['add']);
            $alreadyExist = false;

            foreach ($toAdd as $add) {
                $check = ConfAccesoDirecto::GetByCondition(
                    'idusuario = ? AND idfuncionalidad = ?',
                    array($idusuario, $add), true
                );
                $alreadyExist = count($check);

                if (!$alreadyExist) {
                    $response = $this->insertDirectAccess($idusuario, $add, $response);
                }
            }
        }

        return $response;
    }

    public function getChartData($post)
    {
        $tipo = $post['chart'];
        $idestructura = $this->global->Estructura->idestructura;
        $contrato = new DatContrato();
        if ($tipo == 1) {
            return $contrato->getCantContratosporClienteproveedor($idestructura);
        } else {
            if ($tipo == 2) {
                return $contrato->getCantContratosporTipoContrato($idestructura);
            } else {
                return $contrato->getCantContratosportipoCliente($idestructura);
            }
        }
    }

    /**
     * @param $idusuario
     * @param $add
     * @param $response
     *
     * @return mixed
     * @throws Doctrine_Exception
     * @throws Exception
     */
    private function insertDirectAccess($idusuario, $add, $response)
    {
        $model = new ConfAccesoDirecto();
        $model->idaccesodirecto = null;
        $model->idusuario = $idusuario;
        $model->idfuncionalidad = $add;
        $model->idestructura = null;

        $idshorcut = $model->persist();

        if (!is_numeric($idshorcut)) {
            $response['errors'][] = array('code' => 1, 'key' => $add);
            return $response;
        } else {
            $response['success'][] = array('code' => 1, 'key' => $add);
            return $response;
        }
    }

    /**
     * @param $post
     * @param $idusuario
     * @param $response
     *
     * @return mixed
     */
    private function eraseDirectAccess($post, $idusuario, $response)
    {
        $toDel = json_decode($post['del']);
        $conditions = 'idusuario = ? AND idfuncionalidad IN(' . implode(',', $toDel) . ')';
        $flagDel = ConfAccesoDirecto::EraseByCondition($conditions, $idusuario);

        !$flagDel ? $response['errors'][] = array('code' => 2, 'key' => false)
            : $response['success'][] = array('code' => 1, 'key' => true);
        return $response;
    }

    public function obtenerContenidoCorreo($params){
//        print($params['destinatarios'].' || ');
//        print_r(json_decode($params['destinatarios']));
        return array(
            'cuerpo'=>$params['cuerpo'],
            'destinatarios'=>json_decode($params['destinatarios']),
            'attachment'=>$params['attachment']?(array)json_decode($params['attachment']):null
        );
    }

    public function checkAttachment($attachment){
        try{
//            print('/*checkAttachment:'. count($_FILES).'*/');
            $archivos_subidos=array();
            if(count($_FILES)){
                foreach ($_FILES as $file) {
//                    print_r($file);

                    foreach ($attachment as &$att) {
//                        print_r($att);
                        $att=(array)$att;
                        if(isset($att['name_real'])) {
                            if ($att['name_real'] && $att['name_real'] == $file['name']) {

                                $contenido = file_get_contents($file['tmp_name']);
                                $aux=explode('.', $file['name']);
                                $ruta=MailModel::getTemporalName(count($aux)?array_pop($aux):null, $att['nombre']);
//                                print('      '.$ruta);
                                $archivo=fopen($ruta, 'w+');
                                if($archivo!=false) {
//                                  file_put_contents($archivo, $contenido);
                                    $escrito = fwrite($archivo, $contenido);
                                    fflush($archivo);
                                    if ($escrito == false) {
                                        fclose($archivo);
                                        MainModel::eliminarArchivo($ruta);
                                    }else{
                                        $att['ruta']=$ruta;
//                                      $archivos_subidos[$file['name']]=$ruta;
                                    }
                                }
                                break;
                            }
                        }else{
//                            if(file_exists($att['ruta']))
                            continue;
                        }
                    }


                }
            }
//            if(count($archivos_subidos)){
//                foreach($archivos_subidos as $key=>$value) {
//                    foreach ($attachment as &$att) {
//                        if(isset($att['nombre_real'])) {
//                            if ($att['nombre_real'] && $att['nombre_real'] == $key) {
//                                $att['ruta']=$value;
//                                break;
//                            }
//                        }else{
////                            if(file_exists($att['ruta']))
//                            continue;
//                        }
//                    }
//                }
//            }
//            print_r($attachment);
//            die;
            return (array)$attachment;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarArchivo($ruta){
        $result=unlink($ruta);
        return $result;
    }

    public function getRutaTemporal(){
        return $_SERVER['DOCUMENT_ROOT'].'/crm/application/temp/';
    }
}