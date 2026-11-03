<?php

/**
 * ModulesModel
 *
 * Esta es la clase modelo que se encarga de la administracion de los modulos
 * de forma general
 *
 * @package        ERP-PCRM
 * @category       Model
 * @author         Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class ModulesModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Habilita o desabilita los modulos de la aplicacion
     *
     * @param array $post Arreglo con los datos de la peticion
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     */
    public function save($post)
    {
        $response = array('success' => true);
        if(empty($post)){
            $response['success'] = false;
            return $response;
        }

        $modules = array_shift($post);
        $values = json_encode($post);

        $idestructura = $this->global->Estructura->idestructura;

        if(!is_numeric($idestructura) || empty($modules) || empty($values)){
            $response['success'] = false;
            return $response;
        }

        $flagDelete = ConfModulos::EraseByCondition('idestructuracomun=?',$idestructura);

        $model = new ConfModulos();

        $model->config = $modules;
        $model->valores = $values;
        $model->idestructuracomun = $idestructura;

        $idconfig = $model->persist();

        if (!is_numeric($idconfig)) {
            $response['success'] = false;
        }

        $response['record'] = $post;
        return $response;
    }

    /**
     * Obtiene la configuracion de los modulos de la aplicacion
     *
     * @return array Arreglo con la respuesta del servidor
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     */
    public function load()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $response = array('success' => true, 'data' => array());

        if(!is_numeric($idestructura)){
            $response['success'] = false;
            return $response;
        }

        $config = ConfModulos::GetByCondition('idestructuracomun = ?', $idestructura, TRUE);

        if(count($config)){
           $response['data'] = $config[0];
        }

        return $response;
    }
}