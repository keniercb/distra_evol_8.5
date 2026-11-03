<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @author        Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class CamposModel extends ZendExt_Model
{

    public function CamposModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los Campos contables de un subsistema.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                       (debe traer el subsistema en el índice 'ids')
     * @param boolean $comun en caso de tomar valor true se cargan los campos
     *                       contables comunes para todos los subsistemas
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los Campos contables
     */
    public function load($post, $comun = false)
    {
        if ($post['arrIds']) {
            $data = NomCamposContables::GetByIds($post['arrIds'], true);
        } else {
            $start = $post['start'];
            $limit = $post['limit'];
            $utf8 = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò",
                "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê",
                "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
            $estructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $estructura = $post['idestructura'];
            }
            $idsubsistema = (!empty($post['idsubsistema']) && is_numeric(
                    $post['idsubsistema']
                )) ? $post['idsubsistema'] : $this->global->Subsistema->idsubsistema;
            //print_r($idsubsistema);die;
            if ($comun) {
                $conditions = array("(idsubsistema = ? OR idsubsistema = ?) AND idestructuracomun = ?");
                $params = array($idsubsistema, -2, $estructura);
            } else {
                $conditions = array("idsubsistema = ? AND idestructuracomun = ?");
                $params = array($idsubsistema, $estructura);
            }
            if (!empty($post['filter'])) {
                $filter = $post['filter'];
                $conditions[] = "lower(nombre) ILIKE lower('%$filter%')";
                $data = NomCamposContables::GetByCondition(
                    implode(" AND ", $conditions), $params, true, $start, $limit
                );
                $cantidad = NomCamposContables::CountByCondition(
                    implode(" AND ", $conditions), $params
                );
                /* Colocando un highlight al filtro */
                if (count($data)) {
                    foreach ($data as &$campo) {
                        $campo['nombre'] = str_replace(
                            $filter, "<span style=\"background-color: rgb(255, 255, 0);\">"
                            . $filter . "</span>", $campo['nombre']
                        );
                    }
                }
            } else {
                $data = NomCamposContables::GetByCondition(
                    implode(" AND ", $conditions), $params, true, $start, $limit
                );
                $cantidad = NomCamposContables::CountByCondition(
                    implode(" AND ", $conditions), $params
                );
            }
        }
        $paging = array(
            'success' => true,
            'total' => $cantidad,
            'data' => $data
        );
        return $paging;
    }

    /**
     * Eliminar uno o varios Campos contables.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *(almacena los ids de los campos a eliminar en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function delete($post)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());
        if (!empty($post['ids'])) {
            $ids = json_decode(stripslashes($post['ids']), true);
            $total = count($ids);
            $cont = 0;
            foreach ($ids as $idcampo) {
                $result = DatAsientosContables::GetByCondition(
                    'cuenta=?', array($idcampo), true
                );
                if (count($result) == 0) {
                    $result = NomCamposContables::Erase($idcampo);
                    if (!$result) {
                        /* An error was ocurred */
                        //No se ha podido eliminar el campo contable
                        $response['errors'][] = array('code' => 3,
                            'errorcmp' => 'campos',
                            'id' => $idcampo);
                    } else {
                        $response['success'][] = $idcampo;
                    }
                } else {
                    if ($total != 1) {
                        $cont++;
                        if ($cont == $total) {
                            /*All fields are being used*/
                            //Todos los campos estan siendo usados.
                            $response['code'] = 5;
                        } else if ($cont == 1) {
                            /*Only one field is being used*/
                            //Solo un campo esta siendo usado.
                            $response['code'] = 6;
                        } else {
                            /*Not all fields are being used*/
                            //No todos los modelos estan siendo usados.
                            $response['code'] = 7;
                        }
                    } else {
                        /* The field is being used */
                        //El campo está siendo usado.
                        $response['code'] = 4;
                    }
                    $response['errors'][] = array('code' => 8, 'errorcmp' => 'modelo', 'id' => $idcampo);
                }
            }
        } else {
            /* No data to delete */
            //No hay campos contables a eliminar
            $response['errors'][] = array('code' => 2, 'errorcmp' => 'campos');
        }
        return $response;
    }

    /**
     * Inserta un Campo contable.
     *
     * @param array $post Arreglo con los datos del campo contable
     * @param int $idclasificador Identificador del clasificador al que se le registra
     * (puede ser NULL si no pertenece a ningun clasificador)
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function add($post, $idclasificador = null)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());

        if (!empty($post['nombre']) && !empty($post['tipo']) && !empty($post['referencia'])
            && !empty($post['idsubsistema'])
        ) {
            if (!empty($idclasificador)) {
                $condition = array('idclasificador=? AND referencia=?');
                $params = array($idclasificador, $post['referencia']);
                if (!empty($post['id'])) {
                    $condition[] = 'idcampo!=?';
                    $params[] = $post['id'];
                }
                $result = NomCamposContables::GetByCondition(implode(' AND ', $condition), $params, true);
            }
            if (count($result) == 0) {
                $estructura = $this->global->Estructura->idestructura;
                if ($post['idestructura']) {
                    $estructura = $post['idestructura'];
                }
                $idsubsistema = $post['idsubsistema'];

                $condition = array("idsubsistema = ? AND idestructuracomun = ? AND nombre=?");
                $params = array($idsubsistema, $estructura, $post['nombre']);

                if (!empty($post['id'])) {
                    $condition[] = 'idcampo!=?';
                    $params[] = $post['id'];
                }

                $result = NomCamposContables::GetByCondition(implode(' AND ', $condition), $params, true);

                if (count($result) == 0) {
                    /* Si se esta modificando */
                    $objeto = (!empty($post['id']) && is_numeric($post['id'])) ?
                        NomCamposContables::GetById($post['id']) : new NomCamposContables();
                    if (isset($post['ruta'])) {
                        $dir_aplicaction = Zend_Registry::get(
                            'config'
                        )->dir_aplication;
                        $objeto->ruta = str_replace(
                            $dir_aplicaction, '/', $post['ruta']
                        );
                    } else {
                        $objeto->ruta = null;
                    }
                    $objeto->nombre = $post['nombre'];
                    $objeto->idclasificador = $idclasificador;
                    $objeto->tipo = $post['tipo'];
                    $objeto->referencia = $post['referencia'];
                    $objeto->idsubsistema = $post['idsubsistema'];

                    $objeto->idestructuracomun = !empty($post['idestructuracomun']) ?
                        $post['idestructuracomun'] : $estructura;

                    $idcampo = $objeto->persist();

                    if (!is_numeric($idcampo)) {
                        /* Ocurrio un error al insertar el campo contable */
                        $response['errors'][] = array('code' => 4,
                            'errorcmp' => 'campos',
                            'nombre' => $post['nombre']);
                    } else {
                        $objeto = $objeto->toArray();
                        $objeto['text'] = $objeto['nombre'];
                        $objeto['id'] = $objeto['idcampo'];
                        $response['success'] = $objeto;
                    }
                } else {
                    /* Ya existe un campo contable con este nombre */
                    $response['code'] = 7;
                    $response['errors'][] = array('code' => 7, 'errorcmp' => 'campos', 'nombre' => $post['nombre']);
                }
            } else {
                /* El clasificador ya posee este campo contable */
                $response['code'] = 6;
                $response['errors'][] = array('code' => 6, 'errorcmp' => 'campos', 'id' => $result[0]['idcampo']);
            }
        } else {
            /* Faltan datos para adicionar al campo contable */
            $response['code'] = 5;
            $response['errors'][] = array('code' => 5,
                'errorcmp' => 'campos');
        }


        return $response;
    }

    /**
     * Obtiene los subsistemas de la entidad comun que contabilizan.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarsubsistemas($request)
    {
        $idestructura = $this->global->Estructura->idestructura;
        if ($request['idestructura']) {
            $idestructura = $request['idestructura'];
        }
        $subsistemas = array();
        if ($request['idsubsistema'] === '0') {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan(
                $idestructura
            );
        } else {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan(
                $idestructura, $request['idsubsistema']
            );
        }
        return $subsistemas;
    }

    /**
     * Carga los clasificadores de un determinado subsistema.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     * @return mixed Arreglo con los clasificadores
     */
    public function cargarClasificadores($request)
    {
        $clasficador = new ClasificadoresModel();
        return $clasficador->load($request);
    }

    /**
     * Carga los campos de una determinada clase base.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarCampos($request)
    {
        $ruta = str_replace(
            Zend_Registry::get('config')->dir_aplication, '/', $request['ruta']
        );
        ClasificadoresModel::inludeDomainModel(
            Zend_Registry::get('config')->dir_aplication . $ruta
        );
        $entidad = new $request['clase']();
        $array = array_keys($entidad->getData());
        foreach ($array as $key => $value) {
            $result[$key]['denominacion'] = $value;
        }
        return $result;
    }

    /**
     * Carga los directorios del marco de trabajo, para poder cargar una clase.
     *
     * @param array $request Arreglo con la ruta del directorio a cargar
     * @return mixed Arreglo con los datos para cargar el árbol de directorios
     */
    public function cargarDir($request)
    {
        $valores = new ValoresModel();
        return $valores->cargarDir($request);
    }

    /**
     * Carga los metodos de una determinada clase.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarFuncionalidades($request)
    {
        $valores = new ValoresModel();
        return $valores->cargarFuncionalidades($request);
    }

    /**
     * Carga los campos y los datos necesarios para crear un grid de forma dinánica.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @return mixed Arreglo con los campos del store y los datos a mostrar en el
     *               grid.
     */
    public function cargarConfiguracionGrid($request)
    {
        $result = ValoresModel::cargarConfiguracionGrid($request);
        return $result;
    }

    /**
     * Determina el start y el limit dado un identificador para cargar solamente las tuplas de ese intervalo.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @return mixed Arreglo con los campos del store y los datos a mostrar en el
     *               grid.
     */
    public function getRange($request)
    {
        $result=ValoresModel::getRange($request);
        return $result;
    }

}
