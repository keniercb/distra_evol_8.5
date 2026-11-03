<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 * @author     Ing. Alejandro Mengana Pérez <amengana@xetid.cu>
 */
class SubsistemaModel extends ZendExt_Model
{
    private $_confsubsist;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        $this->_confsubsist = new ConfEstructurasubsist();
        parent::ZendExt_Model();
    }

    /**
     * Buscar subsistemas
     *
     * @throws Doctrine_Exception $ee
     */
    public function buscarSubsistema()
    {
        $entidad = $this->global->Estructura->idestructura;
        $obj = DatEstructurasubsist::BuscarEstructuraSubsist($entidad, 2);
        return $obj;
    }

    /**
     * Obtener subsistemas
     *
     * @param int $request ['start'] índice de inicio de la consulta
     * @param int $request ['limit'] índice de la cantidad de datos
     *
     * @return array Retorna un arreglo con la cantidad de elementos y sus datos
     */
    public function obtenerSubsistemas($request)
    {
        $estructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;
        $start = $request['start'];
        $limit = $request['limit'];


        $result = NomSubsistema::getSubsistemasByLimit($estructura, $start, $limit);
        foreach ($result as &$value) {
            foreach ($value as &$val) {
                if ($val == '-1') {
                    $val = null;
                }
            }
        }

        $cant = count(NomSubsistema::getSubsistemasBySql($estructura));

        $response = array('cant' => $cant, 'datos' => $result);
        if($request['precedencia'] && $request['idestructurasubsist']){
            $result = DatSubsistemaPrecedencia::getById($request['idestructurasubsist']);
            $response['precedencia'] = $result;
        }
        return $response;
    }

    /**
     * Carga los directorios del marco de trabajo, para poder cargar la clase
     * que mapea.
     *
     * @param array $request Arreglo con la ruta del directorio a cargar
     *
     * @return mixed Arreglo con los datos para cargar el árbol de directorios
     */
    public function cargardir($request)
    {
        $ruta = $request['node'];
        $arrtreedirectorios = array();
        $dirAplication = Zend_Registry::get('config')->dir_aplication;

        if ($ruta === '0') {
            //toma la ruta de todos los directorios que hay en dir_aplication
            $arrdirectorios = glob($dirAplication . '*', GLOB_ONLYDIR);

            foreach ($arrdirectorios as $value) {
                $arrexplode = explode('/', $value);
                $cantexplode = count($arrexplode);
                $rutanecesaria = str_replace($dirAplication, "", $value);
                $arrtreedirectorios[] = array(
                    'id'            => $value,
                    'text'          => $arrexplode[$cantexplode - 1],
                    'leaf'          => false,
                    'rutanecesaria' => $rutanecesaria
                );
            }
        } else {
            //toma la ruta de todos los directorios que hay en $ruta
            $arrdirectorios = glob($ruta . '/*', GLOB_ONLYDIR);
            //Ciclo que controla los directorios
            foreach ($arrdirectorios as $dir) {
                $explodedir = explode('/', $dir);
                $cantexplodedir = count($explodedir);
                $rutanecesaria = str_replace($dirAplication, "", $dir);
                $arrtreedirectorios[] = array(
                    'id'            => $dir,
                    'text'          => $explodedir[$cantexplodedir - 1],
                    'leaf'          => false,
                    'rutanecesaria' => $rutanecesaria
                );
            }
        }
        return $arrtreedirectorios;
    }

    /**
     * Adiciona o modifica un subsistema para la entidad
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function addModSubsistema($request)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());

        $estructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;

        if (isset($request['codigo']) && isset($request['denominacion']) && isset($request['uri'])
            && isset($request['cierre'])
            && isset($request['estado'])
            && isset($request['contabiliza'])
        ) {

            $flagmodify = false;
            $alreadyExistIdSubsistema = false;
            $alreadyExistDenomSubsistema = false;
            $alreadyExistBoth = false;

            /* Si se esta modificando */
            if ($request['modifica'] === 'true') {
                $nomSubsistema = NomSubsistema::GetByCondition(
                    "idsubsistema=?", array($request['codigo']), false
                );

                if (empty($request['idestructurasubsist'])) {
                    $estrucSubsist = array(new DatEstructurasubsist());
                } else {
                    $estrucSubsist = DatEstructurasubsist::GetByCondition(
                        "idestructurasubsist=?",
                        array($request['idestructurasubsist']), false
                    );
                }

                $flagmodify = true;
            } else {
                /* Se está adicionando */
                $nomSubsistema = array(new NomSubsistema());
                $estrucSubsist = array(new DatEstructurasubsist());
            }

            if (!$flagmodify) {
                //Si no se está modificando se verifica si existe el subsistema
                //Chequear si existe el id del subsistema
                $checkIdSubsistema = NomSubsistema::GetByCondition(
                    "idsubsistema=?", array($request['codigo']), false
                );
                $alreadyExistIdSubsistema = count($checkIdSubsistema) > 0;
                //Chequear si existe la denominación del subsistema
                $checkDenomSubsistema = NomSubsistema::GetByCondition(
                    "denominacion=?", array($request['denominacion']), false
                );
                $alreadyExistDenomSubsistema = count($checkDenomSubsistema) > 0;
                //Chequear si existen las dos opciones
                $alreadyExistBoth
                    = $alreadyExistIdSubsistema && $alreadyExistDenomSubsistema;
            }

            if ($alreadyExistBoth) {
                //Existen las dos opciones
                //O sea que ya existe el id del subsistema y la denominación del subsistema
                $response['errors'][] = array('code'         => 2,
                                              'idsubsistema' => $request['codigo'],
                                              'denominacion' => $request['denominacion']);
            } else {
                if ($alreadyExistIdSubsistema) {
                    //Ya existe el id del subsistema
                    $response['errors'][] = array('code'         => 3,
                                                  'idsubsistema' => $request['codigo']);
                } else {
                    if ($alreadyExistDenomSubsistema) {
                        //Ya existe la denominación del subsistema
                        $response['errors'][] = array('code'         => 4,
                                                      'denominacion' => $request['denominacion']);
                    } else {
                        //No existe de ninguna manera el subsistema
                        //Entonces se pasa a adicionar el mismo
                        //Datos del nomenclador de subsistemas
                        $nomSubsistema[0]->idsubsistema = $request['codigo'];
                        $nomSubsistema[0]->denominacion
                            = $request['denominacion'];
                        $nomSubsistema[0]->uri = $request['uri'];

                        $subsistema = $nomSubsistema[0]->persist();

                        if (!is_numeric($subsistema->idsubsistema)) {
                            /* Ocurrió un error al insertar el subsistema X */
                            $response['errors'][] = array('code'         => 5,
                                                          'denominacion' => $request['denominacion']);
                        } else {
                            //Datos de la tabla DatEstructurasubsist
                            $estrucSubsist[0]->idestructuracomun = $estructura;
                            $estrucSubsist[0]->idsubsistema = $subsistema->idsubsistema;
                            $estrucSubsist[0]->idestado = $request['estado'];
                            $estrucSubsist[0]->contabiliza = $request['contabiliza'];
                            $estrucSubsist[0]->cierra = $request['cierre'];

                            $estr = $estrucSubsist[0]->persist();
                            //Se puso aquí el idsubsistema porque no se esta devolviendo el idestructurasubsist
                            if (!is_numeric($estr->idsubsistema)) {
                                /* Ocurrió un error al insertar la asociación de subsistema con la entidad */
                                /* Ocurrió un error al insertar el subsistema X */
                                //Se elimina el subsistema adicionado en el nomenclador
                                NomSubsistema::Erase($subsistema->idsubsistema);
                                $response['errors'][] = array('code'         => 6,
                                                              'denominacion' => $request['denominacion']);
                            } else {
                                $precedencia = json_decode($request['precedencia']);
                                if(DatSubsistemaPrecedencia::deleteById($estr->idestructurasubsist)){
                                    foreach($precedencia as $k => $v){
                                        $instance = new DatSubsistemaPrecedencia();
                                        $instance->idestructurasubsist = $estr->idestructurasubsist;
                                        $instance->idprecedente = $v->idsubsistema;
                                        $instance->save();
                                    }
                                    /* El subsistema se adicionó o modificó satisfactoriamente */
                                    $response['success'][] = $subsistema->idsubsistema;
                                }else{
                                    /* Ocurrio un error eliminando los subsistemas precedentes existentes*/
                                    $response['errors'][] = array('code' => 7);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            /* Faltan datos para adicionar el subsistema */
            $response['errors'][] = array('code' => 1);
        }
        return $response;
    }

    /**
     * Elimina uno o varios subsistemas
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function del($request)
    {
        try{
            $ids = json_decode(stripslashes($request['ids']), true);
            $response = array('errors' => array(), 'success' => array());
            $estructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;

            if (count($ids) > 0) {
                foreach ($ids as $value) {
                    //Esto se cumple cuando no hay subsistema asociado a la entidad
                    if (empty($value['idestructurasubsist'])) {
                        $delsub = NomSubsistema::EraseByCondition(
                            "idsubsistema = ?", array($value['idsubsistema'])
                        );
                        if (!$delsub) {
                            /*
                             * Ocurrió un error al eliminar el subsistema X
                             */
                            $response['errors'][] = array('code'         => 8,
                                                          'denominacion' => $value['denominacion']);
                        } else {
                            //Se elimino el subsistema satisfactoriamente
                            $response['success'][] = $value['idsubsistema'];
                        }
                    } else {//Sino es que el subsistema está asociado a la entidad
                        $conditions = 'idsubsistema = ? AND idestructuracomun = ?';
                        $delestrucsub = DatEstructurasubsist::EraseByCondition(
                            $conditions, array($value['idsubsistema'], $estructura)
                        );

                        //Ocurrió un error al eliminar la asociación del subsistema con la entidad
                        //Ocurrió un error al eliminar el subsistema X
                        if (!$delestrucsub) {
                            $response['errors'][] = array('code'         => 9,
                                                          'denominacion' => $value['denominacion']);
                        } else {
                            //Se pasa a eliminar la referencia en el nomencaldor
                            $delsub = NomSubsistema::EraseByCondition(
                                "idsubsistema = ?", array($value['idsubsistema'])
                            );
                            if ($delsub === 23503) {
                                //El subsistema X está siendo usado por otra entidad
                                $response['errors'][] = array('code'         => 11,
                                                              'denominacion' => $value['denominacion']);
                            } else {
                                if (!$delsub) {
                                    //Ocurrió un error al eliminar el subsistema X
                                    $response['errors'][] = array('code'         => 10,
                                                                  'denominacion' => $value['denominacion']);
                                } else {
                                    //Se elimino el subsistema satisfactoriamente
                                    $response['success'][] = $value['idsubsistema'];
                                }
                            }
                        }
                    }
                }
            } else {
                //No hay datos para eliminar el o los subsistemas
                $response['errors'][] = array('code' => 7);
            }
            return $response;
        }catch (Exception $e){
            $response['errors'][] = array('code' => $e->getCode(), 'msg' => $e->getMessage());
            return $response;
        }
    }

    /**
     * Modifica el campo cierre del subsistema
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function cambiarCierre($request)
    {
        $response = array('errors' => array(), 'success' => array());
        $estructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;

        //Si se cumple esta condición es porque el subsistema no está
        //asociado con la entidad
        if (empty($request['idestructurasubsist'])) {
            $estrucSub = array(new DatEstructurasubsist());
            $estrucSub[0]->idsubsistema = $request['idsubsistema'];
            $estrucSub[0]->idestado = 0;
            $estrucSub[0]->idestructuracomun = $estructura;
            $estrucSub[0]->contabiliza = 0;
            $estrucSub[0]->cierra = $request['cierra'];
        } else {//Sino es porque tiene la asciación con el subsistema la entidad
            $estrucSub = DatEstructurasubsist::GetByCondition(
                'idestructurasubsist = ?',
                array($request['idestructurasubsist'])
            );
            $estrucSub[0]->cierra = $request['cierra'];
        }

        $resultPersist = $estrucSub[0]->persist();
        if (!is_numeric($resultPersist->idsubsistema)) {
            //Ocurrió un error al modificar el cierre del subsistema X
            $response['errors'][] = array('code'         => 11,
                                          'denominacion' => $request['denominacion']);
        } else {
            //Se modificó el cierre del subsistema satisfactoriamente
            $response['success'][] = $request['idsubsistema'];
        }
        return $response;
    }

    /**
     * Modifica el campo idestado del subsistema en la tabla
     * DatEstructurasubsist
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function cambiarEstado($request)
    {
        $response = array('errors' => array(), 'success' => array());
        $estructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;

        //Si se cumple esta condición es porque el subsistema no está
        //asociado con la entidad
        if (empty($request['idestructurasubsist'])) {
            $estrucSub = array(new DatEstructurasubsist());
            $estrucSub[0]->idsubsistema = $request['idsubsistema'];
            $estrucSub[0]->idestado = $request['idestado'];
            $estrucSub[0]->idestructuracomun = $estructura;
            $estrucSub[0]->contabiliza = 0;
            $estrucSub[0]->cierra = 0;
        } else {//Sino es porque tiene la asciación con el subsistema la entidad
            $estrucSub = DatEstructurasubsist::GetByCondition(
                'idestructurasubsist = ?',
                array($request['idestructurasubsist'])
            );
            $estrucSub[0]->idestado = $request['idestado'];
        }

        $resultPersist = $estrucSub[0]->persist();
        if (!is_numeric($resultPersist->idsubsistema)) {
            //Ocurrió un error al modificar el estado del subsistema X
            $response['errors'][] = array('code'         => 12,
                                          'denominacion' => $request['denominacion']);
        } else {
            //Se modificó el estado del subsistema satisfactoriamente
            $response['success'][] = $request['idsubsistema'];
        }
        return $response;
    }

    /**
     * Modifica el campo contabiliza del subsistema en la tabla
     * DatEstructurasubsist
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function cambiarContabilizacion($request)
    {
        $response = array('errors' => array(), 'success' => array());
        $estructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;

        //Si se cumple esta condición es porque el subsistema no está
        //asociado con la entidad
        if (empty($request['idestructurasubsist'])) {
            $estrucSub = array(new DatEstructurasubsist());
            $estrucSub[0]->idsubsistema = $request['idsubsistema'];
            $estrucSub[0]->idestado = 0;
            $estrucSub[0]->idestructuracomun = $estructura;
            $estrucSub[0]->contabiliza = $request['contabiliza'];
            $estrucSub[0]->cierra = 0;
        } else {//Sino es porque tiene la asciación con el subsistema la entidad
            $estrucSub = DatEstructurasubsist::GetByCondition(
                'idestructurasubsist = ?',
                array($request['idestructurasubsist'])
            );
            $estrucSub[0]->contabiliza = $request['contabiliza'];
        }

        $resultPersist = $estrucSub[0]->persist();
        if (!is_numeric($resultPersist->idsubsistema)) {
            //Ocurrió un error al modificar la contabilización del subsistema X
            $response['errors'][] = array('code'         => 13,
                                          'denominacion' => $request['denominacion']);
        } else {
            //Se modificó la contabilización del subsistema satisfactoriamente
            $response['success'][] = $request['idsubsistema'];
        }
        return $response;
    }

    /**
     * Guarda los subsitemas configurados para la entidad actual como una plantilla
     * para ser usados posteriormente por otra entidad
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function crearPlantilla($request)
    {
        try {
            $instance = Doctrine_Manager::getInstance();
            $conexion = $instance->getCurrentConnection();
            $request['conexion'] = $conexion;
            $result = $this->integrator->datosmaestros->insertarPlantilla($request);
            $idestructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;
            $subsitemas = DatEstructurasubsist::GetByCondition(
                'idestructuracomun=? AND idestado=?', array($idestructura, 1), true
            );
            if ($result['id']) {
                foreach ($subsitemas as $row) {
                    $conf = new ConfEstructurasubsist();
                    $conf->idsubsistema = $row['idsubsistema'];
                    $conf->contabiliza = $row['contabiliza'];
                    $conf->cierra = $row['cierra'];
                    $conf->idplantilla = $result['id'];
                    $conf->save();
                }
            }
            return array('code' => 1, 'msg' => '');
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function usarPlantilla($request)
    {
        try {
            $result = $this->integrator->datosmaestros->listarPlantillas($request);
            $idestructura = $request['idestructura'] ? $request['idestructura'] : $this->global->Estructura->idestructura;
            if (count($result['data'])) {
                $params = $result['data'][0];
                $subsistemas = $this->_confsubsist->getSubsistemas($params);
                if (count($subsistemas)) {
                    DatEstructurasubsist::EraseByCondition('idestructuracomun=?', array($idestructura));
                }
                foreach ($subsistemas as $row) {
                    $instance = new DatEstructurasubsist();
                    $instance->idsubsistema = $row['idsubsistema'];
                    $instance->contabiliza = $row['contabiliza'];
                    $instance->cierra = $row['cierra'];
                    $instance->idestructuracomun = $idestructura;
                    $instance->save();
                }
            }
            return array('code' => 1, 'msg' => '');
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage());
        }
    }

    /**
     * Lista las plantillas creadas para este componente
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con las plantillas disponibles
     */
    public function listarPlantillas($request)
    {
        try {
            return $this->integrator->datosmaestros->listarPlantillas($request);
        } catch (Exception $e) {
            throw $e;
        }
    }

}
