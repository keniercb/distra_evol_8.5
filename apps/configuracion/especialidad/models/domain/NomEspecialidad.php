<?php

/**
 * Componente que gestiona las especialidades por subsistemas
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Especialidad/Models/Domain
 * @version    1.0
 */
class NomEspecialidad extends BaseNomEspecialidad
{
    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomEspecialidad', array('local' => 'idespecialidad', 'foreign' => 'idpadre'));
        $this->hasOne('NomEspecialidad', array('local' => 'idpadre', 'foreign' => 'idespecialidad'));
    }

    /**
     * Obtener todos
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad
     */
    public static function getAll()
    {
        $query = new Doctrine_Create();
        $result = $query->select('x.*')
            ->from('NomEspecialidad x')
            ->fetchArray();
        return $result;
    }

    /**
     * Obtener especialidades por filtro
     *
     * @param string $argFilters Filtro
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad filtrados
     */
    static public function getEspecialidades($argFilters = '')
    {
        if ($argFilters['service']) {
            $where = $argFilters['service'];
        } else {
            if ($argFilters['filter'] != '') {
                $idespecialidad = $argFilters['node'];
                $filter = $argFilters['filter'];
            }
            $where = ($idespecialidad)
                ? "ne.idpadre = $idespecialidad AND ne.idpadre <> ne.idespecialidad"
                :
                (($filter) ? "" : "ne.idpadre = ne.idespecialidad");
        }
        if ($argFilters['filter'] != '') {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $sql = "SELECT distinct ne.idespecialidad, ne.abrevespecialidad,ne.ordenizq,ne.ordender,
                ne.codespecialidad,ne.idpadre, ne.nivel,ne.controlmaterial, ne.denespecialidad,ne.fechafin, ne.fechaini,
                ne.denespecialidad as qtip, ne.idespecialidad as id, CONCAT(CONCAT(ne.codespecialidad,' ') ,
                ne.denespecialidad) as text, ((ne.ordender - ne.ordenizq) = 1) as leaf
            FROM mod_datosmaestros.nom_especialidad ne, mod_datosmaestros.nom_especialidad h
            WHERE (h.ordenizq BETWEEN ne.ordenizq and ne.ordender) 
            AND (h.codespecialidad ilike '%$filter%' OR h.denespecialidad ilike '%" . $filter . "%')
            order by 
            ne.nivel";
            $result = $conexionActual->fetchAll($sql);
        } else {
            $query = new Doctrine_Query();
            $result = $query->select(
                "ne.idespecialidad, ne.abrevespecialidad, ne.ordenizq, ne.ordender,
                        ne.codespecialidad, ne.idpadre, ne.nivel,ne.controlmaterial, ne.denespecialidad, ne.fechafin,
                        ne.fechaini, ne.denespecialidad as qtip, ne.idespecialidad as id, 
                        CONCAT(CONCAT(ne.codespecialidad,' ') ,ne.denespecialidad) text, 
                        (
                        (ne.ordender - ne.ordenizq) = 1) as leaf"
            )
                ->from('NomEspecialidad ne')
                ->where($where)
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
        }
        return $result;
    }

    /**
     * Obtener especialidades
     *
     * @return array Retorna un arreglo de objetos de tipo especialidad por hojas en el arbol
     */
    static public function getEspecialidadesHojas()
    {
        $query = new Doctrine_Query();
        return $query
            ->select(
                "ne.idespecialidad, ne.abrevespecialidad, ne.ordenizq,
                            ne.ordender, ne.codespecialidad, ne.idpadre, ne.nivel, ne.denespecialidad,ne.controlmaterial,
                            ne.fechafin, ne.fechaini, ne.denespecialidad as qtip, 
                            ne.idespecialidad as id, CONCAT(CONCAT(ne.codespecialidad,' ') 
                            ,ne.denespecialidad) text, ( (ne.ordender - ne.ordenizq) = 1) as leaf"
            )
            ->from('NomEspecialidad ne')
            ->where('ne.idespecialidad <> ne.idpadre')
            ->orderBy('denespecialidad ASC')
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Obtener especialidad por id
     *
     * @param int $id Identificador de la especialidad
     *
     * @return object Retorna un objeto de tipo especialidad
     */
    public static function getById($id)
    {
        return Doctrine::getTable('NomEspecialidad')->find($id)->fetchArray();
    }

    /**
     * Verificar especialidad
     *
     * @param object $objEspecialidad Objeto de tipo especialidad
     *
     * @return int Retorna un valor indicando si el objeto especialidad existe
     */
    static function verificar($objEspecialidad)
    {
        $codigo = $objEspecialidad->codespecialidad;
        $denomi = $objEspecialidad->denespecialidad;
        $nivel = $objEspecialidad->nivel;
        $objDoctrine = Doctrine_Manager::getInstance();
        $query = $objDoctrine->getCurrentConnection();
        $idpadre = $objEspecialidad->idpadre;
        //print_r($idpadre);die;
        if ($idpadre != '0') {
            $criterio = " AND e.nivel = '$nivel' AND e.idpadre = '$idpadre' ";
        } else {
            $criterio = " AND e.nivel = '$nivel' AND e.idpadre = e.idespecialidad ";
        }
        $codigoEspecialidad = $query->fetchAll(
            "SELECT e.codespecialidad FROM mod_datosmaestros.nom_especialidad e WHERE e.codespecialidad = '$codigo' "
            . $criterio
        );
        if (count($codigoEspecialidad) > 0) {
            return -2;
        }
        $denomEspecialidad = $query->fetchAll(
            "SELECT e.idespecialidad as idespecialidad
              FROM mod_datosmaestros.nom_especialidad e WHERE e.denespecialidad = '$denomi' "
            . $criterio
        );
        if (count($denomEspecialidad) > 0) {
            return -3;
        }
        return -1;
    }

    /**
     * Cargar especialidades
     *
     * @param int $idEspecialidad Identifcador de especialidad
     *
     * @return array Retorna un arreglo de especialidades por subsistemas
     */
    static public function cargarEspecialidades($idEspecialidad, $onlywithcontcode = false)
    {
        $query = Doctrine_Query::create();
        $where = ($idEspecialidad)
            ? "ne.idpadre = $idEspecialidad AND ne.idpadre <> ne.idespecialidad"
            :
            "ne.idpadre = ne.idespecialidad";

        $codeselect = 'ne.codespecialidad';

        return $query->select(
            "idespecialidad as id,ne.abrevespecialidad, $codeselect as codespecialidad,
                    ne.denespecialidad,ne.fechafin, ne.fechaini,
                    ne.denespecialidad as qtip, CONCAT(CONCAT($codeselect,' ') ,
                    ne.denespecialidad) text, ( (ne.ordender - ne.ordenizq) = 1) as leaf, 
                    ne.idespecialidad, ne.idpadre, ne.ordender, ne.ordenizq, ne.nivel,ne.controlmaterial"
        )
            ->from('NomEspecialidad ne')
            ->where($where)
            ->orderby('ne.codespecialidad')
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Verifica primeramente que la fecha inicio y fecha fin de los hijos de un nodo; dado su orden izquierdo y
     * orden derecho, no quede fuera de rango.
     *
     * @param int  $ordenizq
     * @param int  $ordender
     * @param date $fechainicio
     * @param date $fechafin
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return bool|string
     * @throws Doctrine_Connection_Exception
     */
    static public function cargarTodosHijosEspecialidad(
        $ordenizq,
        $ordender, $fechainicio, $fechafin
    ) {

        $objDoctrine = Doctrine_Manager::getInstance();
        $conexion = $objDoctrine->getCurrentConnection();
        $resultado = $conexion
            ->fetchAll(
                "SELECT * FROM mod_datosmaestros.nom_especialidad m
                  WHERE (m.ordenizq > $ordenizq AND m.ordender < $ordender AND '"
                . $fechainicio
                . "' > m.fechaini :: date) ORDER BY m.ordenizq;"
            );
        if (count($resultado) > 0) {
            return 'fechainicio';
        }
        if ($fechafin) {
            $resultadoDos = $conexion
                ->fetchAll(
                    "SELECT * FROM mod_datosmaestros.nom_especialidad m
                      WHERE (m.fechafin != '' AND m.ordenizq > $ordenizq AND m.ordender < $ordender AND '"
                    . $fechafin . "' < m.fechafin) ORDER BY m.ordenizq;"
                );
            if (count($resultadoDos) > 0) {
                return 'fechafin';
            }
        }
        return false;

    }

    /**
     * Obtiene los hijos de un nodo; dado su orden izquierdo y
     * orden derecho.
     *
     * @param int $ordenizq
     * @param int $ordender
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return bool|string
     * @throws Doctrine_Connection_Exception
     */
    static public function cargarHijosEspecialidad(
        $ordenizq,
        $ordender
    ) {

        $objDoctrine = Doctrine_Manager::getInstance();
        $conexion = $objDoctrine->getCurrentConnection();
        return $conexion
            ->fetchAll(
                "SELECT * FROM mod_datosmaestros.nom_especialidad m
                  WHERE (m.ordenizq > $ordenizq AND m.ordender < $ordender) ORDER BY m.ordenizq, m.codespecialidad;"
            );
    }

    /**
     * Buscar denominación
     *
     * @param string $filter Filtro
     *
     * @return array Retorna un arreglo con la denominación de la especialidad
     */
    static public function buscarDenominacion($filter, $onlywithcontcode = false)
    {
        $where = "(ne.codespecialidad ilike '%$filter%' OR ne.denespecialidad ilike '%" . $filter . "%')";

        $codeselect = 'ne.codespecialidad';

        $query = Doctrine_Query::create();
        $result = $query->select(
            "idespecialidad as id,ne.abrevespecialidad, $codeselect,
                    ne.denespecialidad,ne.fechafin, ne.fechaini
                    ne.denespecialidad as qtip, CONCAT(CONCAT($codeselect,' ') ,
                    ne.denespecialidad) text, ( (ne.ordender - ne.ordenizq) = 1) as leaf,
                    ne.idespecialidad, ne.idpadre, ne.ordender, ne.ordenizq, ne.nivel,ne.controlmaterial"
        )
            ->from('NomEspecialidad ne')
            ->where($where)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        /*$utf = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò",
                     "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                     "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê",
                     "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
        foreach ($result as & $especialidad) {
            $especialidad['text'] = str_replace(
                strtr(strtoupper($filter), $utf),
                "<span style=\"background-color: rgb(255, 255, 0);\">" . strtr(
                    strtoupper($filter), $utf
                ) .
                "</span>", strtr(strtoupper($especialidad['text']), $utf)
            );
        }*/
        if ($filter) {
            include_once Zend_Registry::get('config')->dir_aplication .
                'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $result = UtilesDatosMaestros::colorSearch($result, 'text', $filter);
        }
        return $result;
    }

    /**
     * Obtener padre
     *
     * @param int $idpadre Identificador de la especialidad padre
     *
     * @return array Retorna un arreglo con los datos de la especialidad padre
     */
    static public function obtenerPadre($idpadre, $onlywithcontcode = false)
    {
        $where = array('ne.idespecialidad = ?');
        $params = array($idpadre);

        $codeselect = 'ne.codespecialidad';

        $where = implode(' AND ', $where);

        $query = Doctrine_Query::create();
        $result = $query->select(
            "false visitado, ne.idespecialidad as id, CONCAT(CONCAT($codeselect,' ') ,
                  ne.denespecialidad) text,( (ne.ordender - ne.ordenizq) = 1) leaf, $codeselect AS codespecialidad,
                  ne.denespecialidad,ne.abrevespecialidad, ne.idespecialidad, 
                  ne.idpadre, ne.ordender, ne.ordenizq, ne.nivel,ne.controlmaterial"
        )
            ->from('NomEspecialidad ne')
//            ->where("ne.idespecialidad = ?", $idpadre)
            ->where($where, $params)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Verificar si existe la especialidad
     *
     * @param object $objEspecialidad Objeto de tipo especialidad
     * @param int    $idespecialidad  Identificador de la especialidad
     *
     * @return array Retorna un arreglo con los datos de la especialidad
     */
    static function verificarMod($objEspecialidad, $idespecialidad)
    {
        $codigo = $objEspecialidad->codespecialidad;
        $denomi = $objEspecialidad->denespecialidad;
        $nivel = $objEspecialidad->nivel;
        $objDoctrine = Doctrine_Manager::getInstance();
        $query = $objDoctrine->getCurrentConnection();
        $idpadre = $objEspecialidad->idpadre;
        //print_r($idpadre);die;
        if ($idpadre != $idespecialidad) {
            $criterio = " AND e.nivel = '$nivel' AND e.idpadre = '$idpadre' AND e.idespecialidad <> $idespecialidad ";
        } else {
            $criterio
                = " AND e.nivel = '$nivel' AND e.idpadre = e.idespecialidad AND e.idespecialidad <> $idespecialidad ";
        }
        $codigoEspecialidad = $query->fetchAll(
            "SELECT e.idespecialidad as idespecialidad
              FROM mod_datosmaestros.nom_especialidad e WHERE e.codespecialidad = '$codigo' "
            . $criterio
        );
        if (count($codigoEspecialidad) > 0) {
            return -2;
        }
        $denomEspecialidad = $query->fetchAll(
            "SELECT e.idespecialidad as idespecialidad
              FROM mod_datosmaestros.nom_especialidad e WHERE e.denespecialidad = '$denomi' "
            . $criterio
        );
        if (count($denomEspecialidad) > 0) {
            return -3;
        }
        return -1;


        /*$codigoEspecialidad = $query->select(
            'e.idespecialidad as idespecialidad'
        )
            ->from('NomEspecialidad e')
            ->where(
                "e.codespecialidad = '$codigo' AND e.idpadre = $idpadre
                AND e.idespecialidad <> $idespecialidad AND e.nivel = $nivel"
            )
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();

        $denomEspecialidad = $query->select(
            'e.idespecialidad as idespecialidad'
        )
            ->from('NomEspecialidad e')
            ->where(
                "e.denespecialidad = '$denomi' AND e.idpadre = $idpadre
                AND e.idespecialidad <> $idespecialidad AND e.nivel = $nivel"
            )
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        if (count($codigoEspecialidad) > 0) {
            return -2;
        } elseif (count($denomEspecialidad) > 0) {
            return -3;
        }
        return -1;*/
    }

    /**
     * Obtener arreglo de especialidades
     *
     * @param int $idestructura Identificador de la estructura
     *
     * @return array Retorna un arreglo con los datos de la especialidad
     */
    static function obtenerArrayEspecialidad($idestructura)
    {
        $query = new Doctrine_Query();
        $result = $query
            ->select(
                "ne.idespecialidad, ne.abrevespecialidad as abreviatura, ne.nivel,ne.controlmaterial
                     ne.codespecialidad as concat, ne.denespecialidad as descripcion, 
                     ne.fechafin, ne.fechaini, CONCAT(CONCAT(ne.codespecialidad,' ') ,ne.denespecialidad) text"
            )
            ->from('NomEspecialidad ne')
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        $query->free();
        return $result;
    }

    public function obtenerEspecialidadParametros($parametros)
    {
        try {
            $query = Doctrine_Query::create();
            $query->select('ne.*')->from('NomEspecialidad ne')
                ->orderBy('ne.codespecialidad')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY);

            $filtro = $this->crearFiltro($parametros);

            if (count($filtro)) {
                $query->addWhere(implode(" AND ", $filtro));
            }
            $result = $query->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function crearFiltro($parametros)
    {
        $alias = "ne";
        $claves = array('codigo'      => 'codespecialidad', 'denominacion' => 'denespecialidad',
                        'abreviatura' => 'abrevespecialidad', 'nombre' => 'denespecialidad', 'nodo' => 'idpadre',
                        'node'        => 'idpadre', 'id' => 'idespecialidad');
        $filtro = [];
        foreach ($parametros as $clave => $valor) {
            $clave = $claves[$clave] ? $claves[$clave] : $clave;
            $columna = $this->getTable()->getColumnDefinition($clave);
            if ($clave == 'idpadre') {
                $idpadre = true;
            }
            if ($columna) {
                if (is_array($valor)) {
                    if ($columna['type'] == 'varchar') {
                        $valor = $this->convertirArregloString($valor);
                    }
                    $filtro[] = $alias . '.' . $clave . ' in (' . implode(',', $valor) . ')';
                } else {
                    if ($columna['type'] == 'numeric') {
                        $filtro[] = $alias . '.' . $clave . '=' . $valor;
                    }

                    if ($columna['type'] == 'varchar') {
                        $filtro[] = $alias . '.' . $clave . ' ILIKE \'%' . $valor . '%\'';
                    }
                }
            }
        }
        return $filtro;

    }

    function convertirArregloString($arreglo)
    {
        foreach ($arreglo as $k => $v) {
            $arreglo[$k] = '\'' . $v . '\'';
        }
        return $arreglo;
    }

}
