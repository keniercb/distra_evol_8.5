<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class FormatoModel extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function __constructFormatoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar datos de formato
     *
     * @param object $obj          Objeto de tipo formato
     * @param int    $idestructura Identificador de estructura
     *
     * @return boolean Retorna verdadero en caso de guardar los datos falso en otro caso
     * @throws Doctrine_Exception $error Excepción de Doctrine ocurrida durante la transacción.
     */
    public function insertarDatFormato(&$obj, $idestructura = null)
    {
        try {
            if (!$idestructura) {
                $idestructura = $this->global->Estructura->idestructura;
            }
            $formato = $obj->buscarFormato(array('nombre' => $obj->nombre, 'idestructuracomun' => $idestructura));
            if (!$formato['cant']) {
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $error) {
            throw new ZendExt_Exception('CONF106', $error);
        }
    }

    /**
     * Eliminar datos de formato
     *
     * @param object $obj Objeto de tipo formato
     *
     * @return boolean Retorna verdadero en caso de eliminar los datos falso en otro caso
     * @throws Doctrine_Exception $ee Excepción de Doctrine ocurrida durante la transacción.
     */
    public function eliminarDatFormato($obj)
    {
        try {
            $obj->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Modificar datos de formato
     *
     * @param object $obj Objeto de tipo formato
     *
     * @return boolean Retorna verdadero en caso de modificar los datos falso en otro caso
     * @throws Doctrine_Exception $ee Excepción de Doctrine ocurrida durante la transacción.
     */
    public function modificarDatFormato($obj, $idestructura)
    {
        try {
            if (!$idestructura) {
                $idestructura = $this->global->Estructura->idestructura;
            }
            $nombre = $obj->nombre;
            $descripcion = $obj->descripcion;
            $separador = $obj->separador;
            $idformato = $obj->idformato;
            $version = $obj->version;
            $nv = $obj->nivelpais;
            $idsubsistema = $obj->idsubsistema;

            $versiono = self::Verificarversion($idformato);
            if ($versiono != $version) {
                throw new ZendExt_Exception('CONF104');
            }

            $formato = $obj->buscarFormato(
                array('nombre' => $nombre, 'idestructuracomun' => $idestructura, 'idsubsistema' => $idsubsistema)
            );

            $valid = false;
            if ($formato['cant'] == 1 && $formato['datos'][0]['idformato'] == $idformato) {
                $valid = true;
            } else {
                if (!$formato['cant']) {
                    $valid = true;
                } else {
                    $valid = false;
                }
            }
            if ($valid) {
                $obj->nombre = $nombre;
                $obj->descripcion = $descripcion;
                $obj->separador = $separador;
                $obj->idformato = $idformato;
                $obj->nivelpais = $nv;
                $obj->idsubsistema = $idsubsistema;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF108', $ee);
        }
    }

    /**
     * Cargar datos de formato
     *
     * @param  array $cond Arreglo de condiciones
     *
     * @return array Retorna un arreglo de objetos de tipo formato
     *
     */
    public function CargarFormatos($cond = array())
    {
        $formatos = DatFormato::FormatosC(
            "e.idformato,e.nombre,e.descripcion,e.separador as
            longitud,e.separador,e.separador as estructura,e.separador 
            as vistap,e.nivelpais,e.version,e.idsubsistema,s.denominacion", $cond
        );
        $partesform = DatParteformato::ParteFormatoC("idparteformato,nombre,abreviatura,nivel,longitud,idformato");

        $form = array();
        $sumlong = array();
        $vistap = array();
        foreach ($formatos as $i => $pfr) {
            foreach ($partesform as $pform) {
                if ($pfr['idformato'] == $pform['idformato']) {
                    $form[$pfr['idformato']][$pform['nivel']] = $pform['abreviatura'];
                    $vistap[$pfr['idformato']][$pform['nivel']] = self::GenerarCeros($pform['longitud']);
                    $sumlong[$pfr['idformato']] += $pform['longitud'];
                }
            }
            if ($pfr['nivelpais'] == 1) {
                $formatos[$i]['nivelpais'] = true;
            } else {
                $formatos[$i]['nivelpais'] = false;
            }

            if ($form[$pfr['idformato']]) {
                ksort($form[$pfr['idformato']]);
                ksort($vistap[$pfr['idformato']]);
                $formatos[$i]['longitud'] = $sumlong[$pfr['idformato']];
                if (count($form[$pfr['idformato']]) > 1) {
                    $formatos[$i]['estructura'] = implode($pfr['separador'], (array)$form[$pfr['idformato']]);
                    $formatos[$i]['vistap'] = implode($pfr['separador'], (array)$vistap[$pfr['idformato']]);
                } else {
                    $key = array_keys((array)$form[$pfr['idformato']]);
                    $formatos[$i]['estructura'] = (array)$form[$pfr['idformato']][$key[0]];
                    $formatos[$i]['vistap'] = implode($pfr['separador'], (array)$vistap[$pfr['idformato']]);
                }
            } else {
                $formatos[$i]['estructura'] = '';
                $formatos[$i]['vistap'] = '';
                $formatos[$i]['longitud'] = '0';
            }
        }
        if ($cond['sfFiltro']) {
            include_once Zend_Registry::get('config')->dir_aplication .
                'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $formatos = UtilesDatosMaestros::colorSearch(
                $formatos, array('nombre', 'descripcion', 'separador'),
                array($cond['sfFiltro'], $cond['sfFiltro'], $cond['sfFiltro'])
            );
        }
        return $formatos;
    }

    /**
     * Generar ceros
     *
     * @param  int $count Cantidad de ceros a generar
     *
     * @return string Retorna una variable con la cantidad de ceros generados
     *
     */
    public function GenerarCeros($count)
    {
        $cad = '';
        for (
            $i = 0; $i < $count; $i++
        ) {
            $cad .= '0';
        }
        return $cad;
    }

    /**
     * Verificar la versión del formato
     *
     * @param  int $idformato Identificador de formato
     *
     * @return int Retorna la versión del formato
     *
     */
    public function Verificarversion($idformato)
    {
        $result = Doctrine::getTable('DatFormato')->find($idformato);
        $version = $result->toArray();
        return $version['version'];
    }

    /**
     * Cantidad de formato
     *
     * @param  array $cond Arreglo de condiciones
     *
     * @return int Retorna la cantidad de formatos que cumplen con las condiciones
     *
     */
    public function CantidadFormatos($cond = array())
    {
        $result = DatFormato::CantidadFormatos($cond);
        return $result;
    }

    /**
     * Cantidad de formato
     *
     * @param  int $idEstructura Identificador de estructura
     *
     * @return int Retorna la cantidad de formatos asociados a la estructura
     *
     */
    public function cantidadFormatoIn($idEstructura)
    {

        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(u.idformato) as cant')
            ->from('DatFormato u')
            ->where("u.idestructura ='$idEstructura'")
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * Cantidad parte de formato
     *
     * @param  int $idEstructura Identificador de estructura
     *
     * @return int Retorna la cantidad de formatos asociados a la estructura
     *
     */
    public function cantidadParteFormatoIn($idEstructura)
    {

        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(u.idparteformato) as cant')
            ->from('DatParteformato u')
            ->innerJoin('u.DatFormato f')
            ->where("f.idestructura ='$idEstructura'")
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * Cantidad formatos a heredar
     *
     * @param  array $post Arreglo de posiciones o indices
     *
     * @return array Retorna un arreglo con la cantidad y los datos
     *
     */
    public function cargarFormatosHeredar($post)
    {
        $start = isset($post['start']) ? $post['start'] : 0;
        $limit = isset($post['limit']) ? $post['limit'] : 20;
        $data = array();
        $paging = array();
        $idestructura = $post['idestructura'] ? $post['idestructura'] : $this->global->Estructura->idestructura;
        $estpadre = $this->integrator->metadatos->obtenerPadreEntidad($idestructura);
        $idpadre = $estpadre[0]->idestructura;
        $modelDomain = new DatFormato();
        if ((is_numeric($idestructura) && is_numeric($idpadre)) && $idestructura != $idpadre) {
            $data = $modelDomain->getFormatosHeredar($idestructura, $idpadre);
            $partesform = DatParteformato::ParteFormatoC("idparteformato,nombre,abreviatura,nivel,longitud,idformato");
            $form = array();
            $sumlong = array();
            $vistap = array();
            foreach ($data as $i => $pfr) {
                foreach ($partesform as $pform) {
                    if ($pfr['idformato'] == $pform['idformato']) {
                        $form[$pfr['idformato']][$pform['nivel']] = $pform['abreviatura'];
                        $vistap[$pfr['idformato']][$pform['nivel']] = self::GenerarCeros($pform['longitud']);
                        $sumlong[$pfr['idformato']] += $pform['longitud'];
                    }
                }
                if ($pfr['nivelpais'] == 1) {
                    $data[$i]['nivelpais'] = true;
                } else {
                    $data[$i]['nivelpais'] = false;
                }

                if ($form[$pfr['idformato']]) {
                    ksort($form[$pfr['idformato']]);
                    ksort($vistap[$pfr['idformato']]);
                    $data[$i]['longitud'] = $sumlong[$pfr['idformato']];
                    if (count($form[$pfr['idformato']]) > 1) {
                        $data[$i]['estructura'] = implode($pfr['separador'], (array)$form[$pfr['idformato']]);
                        $data[$i]['vistap'] = implode($pfr['separador'], (array)$vistap[$pfr['idformato']]);
                    } else {
                        $key = array_keys((array)$form[$pfr['idformato']]);
                        $data[$i]['estructura'] = (array)$form[$pfr['idformato']][$key[0]];
                        $data[$i]['vistap'] = implode($pfr['separador'], (array)$vistap[$pfr['idformato']]);
                    }
                } else {
                    $data[$i]['estructura'] = '';
                    $data[$i]['vistap'] = '';
                    $data[$i]['longitud'] = '0';
                }
            }
        }
        if (count($data) > 0) {
            $paging = array(
                'success' => true,
                'total'   => count($data),
                'data'    => array_splice($data, $start, $limit)
            );
        }
        return $paging;
    }

    /**
     * Heredar formatos
     *
     * @param  array $post Arreglo de formatos
     *
     * @return array Retorna un arreglo con el código, un arreglo de errores y otro arreglo con los datos
     *
     */
    public function heredarFormatos($post)
    {
        $formatos = json_decode(stripslashes($post['formatos']));
        $estructura = $post['idestructura'] ? $post['idestructura'] : $this->global->Estructura->idestructura;
        $response = array(
            'code'    => 1,
            'errors'  => array(),
            'success' => array(),
        );
        if (count($formatos) > 0) {
            $modelBussines = new DatFormatoEntidadModel();
            foreach ($formatos as $formato) {
                $modelDomain = new DatFormatoEntidad();
                $modelDomain->idformato = $formato->id;
                $modelDomain->idestructuracomun = $estructura;

                $result = $modelBussines->Insertar($modelDomain);
                if (!$result) {
                    $response['code'] = 3;
                    $response['errors'][] = array('formato' => $formato->nombre);
                } else {
                    $response['success'][] = array('formato' => $formato->nombre);
                }
            }
            unset($modelBussines);
        } else {
            $response['code'] = 2;
        }
        return $response;
    }

    public function cargarAperturas($post)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idestructura = $post['idestructura'] ? $post['idestructura'] : $idestructura;
        $result = array();
        if($this->existeContabilidad()){
            $result = $this->integrator->contabilidad->obtenerAperturasNomencladorPorEntidad($idestructura);
        }
        return array('data'=>$result);
    }

    public function existeContabilidad()
    {
        try {
            $dir = Zend_Registry::get('config')->dir_aplication
                . 'contabilidad/comun/recursos/xml/ioc.xml';
            return file_exists($dir);
        } catch (Exception $e) {
            return false;
        }
    }

}

