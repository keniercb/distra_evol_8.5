<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class DatEstructurasubsist extends BaseDatEstructurasubsist
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        $this->hasOne(
            'NomSubsistema',
            array('local' => 'idsubsistema', 'foreign' => 'idsubsistema')
        );
        $this->hasMany(
            'DatFecha', array('local'   => 'idestructurasubsist',
                              'foreign' => 'idestructurasubsist')
        );
        $this->hasMany(
            'DatSubsistemaPrecedencia',
            array('local' => 'idestructurasubsist', 'foreign' => 'idestructurasubsist')
        );
        parent::setUp();
    }

    /**
     * Buscar estructura subsistema
     *
     * @param int $identidad Identificador de entidad
     * @param int $idsubsist Identificador de subsistema
     *
     * @return array Retorna un arreglo  de tipo estructura subsistema
     */
    static public function buscarEstructuraSubsist($identidad, $idsubsist)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select("s.*")
                ->from("DatEstructurasubsist s")
                ->where(
                    "s.idestructuracomun= ? and s.idsubsistema= ? ",
                    array($identidad, $idsubsist)
                )
                ->execute()
                ->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar estructura subsistema
     *
     * @param int $identidad Identificador de entidad
     * @param int $idsubsist Identificador de subsistema
     *
     * @return array Retorna un arreglo  de tipo estructura subsistema
     */
    static public function BuscarEstructuraSubsistEstado(
        $identidad, $idsubsist, $idestado
    ) {
        try {
            $q = new Doctrine_Query();
            $result = $q->select(
                "s.idsubsistema,s.idestado,s.version,s.idestructurasubsist,s.idestructuracomun"
            )
                ->from("DatEstructurasubsist s")
                ->where(
                    "s.idestructuracomun= " . $identidad
                    . " and s.idsubsistema= "
                    . $idsubsist . " and s.idestado= " . $idestado
                )
                ->execute()
                ->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar estructura subsistema
     *
     * @param int $identidad Identificador de entidad
     * @param int $idsubsist Identificador de subsistema
     *
     * @return array Retorna un arreglo de objeto de tipo estructura subsistema
     */
    static public function BuscarEstructuraSubsistObjet($identidad, $idsubsist)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select(
                "s.idsubsistema,s.idestado,s.version,s.idestructurasubsist,s.idestructuracomun"
            )
                ->from("DatEstructurasubsist s")
                ->where(
                    "s.idestructuracomun= ? and s.idsubsistema= ? ", array(
                        $identidad, $idsubsist
                    )
                )
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas estado
     *
     * @param int $identidad Identificador de entidad
     * @param int $idestado  Identificador de estado
     *
     * @return array Retorna un arreglo de objetos de tipo subsistema estado
     */
    static public function BuscarSubsistemasEstado($identidad, $idestado)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select(
                "s.idsubsistema,s.idestado,s.version,s.idestructurasubsist,s.idestructuracomun"
            )
                ->from("DatEstructurasubsist s")
                ->where(
                    "s.idestructuracomun= " . $identidad . " and s.idestado= "
                    . $idestado
                )
                ->execute()
                ->toArray(true);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar estado subsistema
     *
     * @param int $identidad Identificador de entidad
     * @param int $idsubsist Identificador de subsistema
     *
     * @return object Retorna un objeto de tipo estado subsistema
     */
    static public function BuscarEstadoSubsistema($identidad, $idsubsist)
    {
        try {
            $q = new Doctrine_Query();
            $estsub = $q->select(
                "s.idsubsistema,s.idestado,s.version,s.idestructurasubsist,s.idestructuracomun"
            )
                ->from("DatEstructurasubsist s")
                ->where(
                    "s.idestructuracomun= " . $identidad
                    . "and s.idsubsistema= " . $idsubsist
                )
                ->execute()
                ->toarray(true);
            $result = NomEstadosubsistema::BuscarEstado($estsub->idestado);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas estructura
     *
     * @param type $identidad Identificador de estructura
     *
     * @return array Retorna una arreglo de objetos de tipo subsistema estructura
     */
    static public function BuscarSubsistemasEstructura($identidad)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select(
                "s.idsubsistema,s.idestado,s.version,s.idestructurasubsist,s.idestructuracomun"
            )
                ->from("DatEstructurasubsist s")
                ->where("s.idestructuracomun=" . $identidad)
                ->execute()
                ->toArray(true);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistema(s) que contabilice(n).
     *
     * @param int $argIdEstructuraComun Id estructura com&uacute;n.
     * @param int $argIdSubsistema      Id subsistema del nomenclador.
     *
     * @return Array Arreglo de subsistema(s) que contabilice(n) dado el identificador de la entidad com&uacute;n.
     */
    static public function buscarSubsistemasEstructuraContabilizan($argIdEstructuraComun, $argIdSubsistema = null)
    {
        try {
            $query = new Doctrine_Query();
            $query->select("s.*, n.denominacion as nombsubsistema, n.uri as uri")
                ->from("DatEstructurasubsist s")
                ->innerJoin("s.NomSubsistema n")
                ->where("s.idestructuracomun = ? AND s.contabiliza = 1", $argIdEstructuraComun);
            if (!isset($argIdSubsistema)) {
                $query->addWhere("n.idsubsistema = ?", $argIdSubsistema);
            }
            $result = $query->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas por entidad
     *
     * @param int $identidad Identificador de entidad
     *
     * @return array Retorna un arreglo de objetos de tipo subsistema
     * @throws Doctrine_Exception $exc
     */
    static public function BuscarSubsistemasPorEntidad($identidad)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select("s.idestructurasubsist,n.denominacion,s.idsubsistema,s.cierra")
                ->from("DatEstructurasubsist s")
                ->where("s.idestructuracomun=" . $identidad)
                ->innerJoin("s.NomSubsistema n")
                ->orderby("n.denominacion")
                ->execute()
                ->toArray(true);
            return $result;
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Buscar subsistemas activos por entidad
     *
     * @param int $identidad Identificador de entidad
     *
     * @return array Retorna un arreglo de objetos de tipo subsitema que esten activos
     */
    static public function BuscarSubsistemasActivosPorEntidad($identidad)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $result = $conexionActual->fetchAll(
                "SELECT estsub.idestructurasubsist, sub.denominacion, estsub.idsubsistema,estsub.cierra
            FROM mod_datosmaestros.dat_estructurasubsist estsub
            INNER JOIN mod_datosmaestros.nom_subsistema sub on estsub.idsubsistema = sub.idsubsistema
            INNER JOIN mod_datosmaestros.dat_fecha fe on fe.idestructurasubsist = estsub.idestructurasubsist
            WHERE estsub.idestructuracomun = $identidad
            ORDER BY sub.denominacion;"
            );
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar estructura subsistemas
     *
     * @param int $identidad     Identificador de entidad
     * @param int $idsubsistemas Indentificador de subsistemas
     *
     * @return array Retorna un arreglo con los datos del objeto de tipo estructura subsistema
     * @throws Doctrine_Exception $exc
     */
    static public function BuscarEstructuraSubsit($identidad, $idsubsistemas)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select("s.idestructurasubsist,n.denominacion,s.idsubsistema,s.cierra")
                ->from("DatEstructurasubsist s")
                ->where("s.idestructuracomun=" . $identidad)
                ->whereIn("s.idsubsistema", $idsubsistemas)
                ->innerJoin("s.NomSubsistema n")
                ->orderby("n.denominacion")
                ->execute()
                ->toArray(true);
            return $result;
        } catch (Doctrine_Exception $exc) {
            return $exc;
        }
    }

    /**
     * Cantidad de subsistemas
     *
     * @param int $x Identificador de estructuracomùn
     *
     * @return int Retorna la cantidad de objetos encontrados de tipo estructura subsistema
     * @throws Doctrine_Exception $e
     */
    public function CantSubs($x)
    {
        try {
            $query = new Doctrine_Query();
            return $query->from('DatEstructurasubsist d')
                ->where('d.idestructuracomun=?', $x)
                ->count();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtener estructura subsistema por limite
     *
     * @param int $x      Identificador de estructura comùn
     * @param int $limite Cantidad de elemntos a devolver
     * @param int $inicio Indice de la busqueda
     *
     * @return array Retorna un arreglo de objetos de tipo estructura subsistema
     * @throws Doctrine_Exception $e
     */
    public function GetPorLimite($x, $limite = 10, $inicio = 0)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('DatEstructurasubsist d')
                ->where('d.idestructuracomun=?', $x)
                ->limit($limite)->offset($inicio)
                ->orderby("d.idestructurasubsist")
                ->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Encuentra id
     *
     * @param int $id Identificador de subsistema
     *
     * @return int Retorna el id estructura subsistema si es encontrado
     */
    public function EncuentraId($id)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('DatEstructurasubsist d')
                ->select('d.idestructurasubsist')
                ->where('d.idsubsistema=?', $id)
                ->execute()->toArray();
            return $result[0]['idestructurasubsist'];
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Encuentra id entidad
     *
     * @param int $identidad    Identificador de entidad
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return int Retorna el identificador de estructura subsistema
     */
    static public function EncuentraIdEnt($identidad, $idsubsistema)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('DatEstructurasubsist');

            if (is_array($identidad)) {
                $res = $query->where('idsubsistema = ?', $idsubsistema)
                    ->whereIn('idestructuracomun', $identidad)
                    ->execute()->toArray();
                foreach ($res as $key => $value) {
                    $res[$key] = $value['idestructurasubsist'];
                }
                return $res;
            } else {
                $res = $query->where("idestructuracomun = ? and idsubsistema = ? ", array($identidad, $idsubsistema))
                    ->execute()->toArray();
                return $res[0]['idestructurasubsist'];
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas que cierran
     *
     * @return array Retorna un arreglo de subsistemas que cierran
     */
    static public function ObtenerSubsistemasCierran()
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->from('DatEstructurasubsist')->where('cierra = 1')
                ->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistema entidad
     *
     * @param int $idsubsistemaent Identificador de subsistema entidad
     *
     * @return array Retorna un arreglo con los datos del objeto de tipo subsistema entidad
     */
    static public function BuscarSubsistemaEntidad($idsubsistemaent)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->select("s.idestructurasubsist,s.idsubsistema")
                ->from("DatEstructurasubsist s")
                ->where("s.idestructurasubsist=" . $idsubsistemaent)
                ->execute()
                ->toArray(true);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Subsistema aperturado
     *
     * @param int $idestructura Identificador de estructura
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return array Retorna un arreglo con objetos de tipo subsistemas que sean aperturados
     */
    static public function SubsistemaAperturado($idestructura, $idsubsistema)
    {
        try {
            $query = Doctrine_Query::create();
            $array = array($idestructura, $idsubsistema);
            return $query->select('aperturado')
                ->from('DatEstructurasubsist')
                ->where('idestructuracomun = ? AND idsubsistema = ?', $array)
                ->execute()
                ->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Realizar apertura
     *
     * @param int $idestructurasubsist Identificador estructura subsistema
     * @param int $valor               Valor del aperturado
     */
    static public function RealizarApertura($idestructurasubsist, $valor)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatEstructurasubsist')
                ->where("idestructurasubsist=?", array(0 => $idestructurasubsist))
                ->execute();
            $result[0]->aperturado = $valor;
            $result[0]->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener objetos de estructura subsistemas por id
     *
     * @param int $idestructurasubsist Identificador estructura subsistema
     *
     * @return object Objeto de tipo estructura subsistema
     */
    static public function getObjEstructSubsisById($idestructurasubsist)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatEstructurasubsist')
                ->where("idestructurasubsist=?", array(0 => $idestructurasubsist))
                ->execute();

            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function persist()
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false, $start = null, $limit = null)
    {
        try {
            $query = Doctrine_Query::create();

            if ($start === null && $limit === null) {
                $result = $query->from('DatEstructurasubsist')
                    ->where("$condition", $params)
                    ->execute();
            } else {
                $result = $query->from('DatEstructurasubsist')
                    ->where("$condition", $params)
                    ->offset($start)
                    ->limit($limit)
                    ->execute();
            }
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idestructurasubsist)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->delete('DatEstructurasubsist')
                ->where("idestructurasubsist = ?", array($idestructurasubsist))
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->delete('DatEstructurasubsist')
                ->where("$conditions", $params)
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas inactivos que contabilizan incluyendo los idsubsitemas pasados por parametro
     *
     * @param int   $identidad     Identificador de entidad
     * @param array $idsubsistemas Arreglo de idsubsitemas
     *
     * @return array Retorna un arreglo de objetos de tipo subsitema que esten activos
     */
    static public function BuscarSubsistInactivosContab($identidad, $idsubsistemas = array())
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $or = "";
            if (count($idsubsistemas)) {
                $or = "or m1.idsubsistema in (".implode(',',$idsubsistemas).")";
            }
            $result = $conexionActual->fetchAll(
                "SELECT * FROM mod_datosmaestros.dat_estructurasubsist m1 INNER JOIN mod_datosmaestros.nom_subsistema m2
                on m2.idsubsistema = m1.idsubsistema WHERE idestructuracomun = $identidad and contabiliza = 1
                and (idestado = 0 $or);"
            );
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}
