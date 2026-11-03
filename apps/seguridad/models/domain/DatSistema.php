<?php

/**
 * @name DatSistema - Clase dominio de sistema para el acceso a datos.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSistema extends BaseDatSistema
{

    /**
     * @method setUp - Función principal de la clase donde se generan 
     * las relaciones con otros modelos.
     * @return void.
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatSistemaSegRol', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatFuncionalidad',
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatServicio', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatServicioDatSistema', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatSistemaDatServidores', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatSistemaCompartimentacion', 
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
        $this->hasOne(
            'DatSistema as Padre', 
            array('local' => 'idpadre', 'foreign' => 'idsistema')
        );
        $this->hasMany(
            'DatSistema as Hijos', 
            array('local' => 'idsistema', 'foreign' => 'idpadre')
        );
    }

    /**
     * @method cargarsistema - Retorna un listado de sistemas hijos, en caso 
     * de que el nodo inicial sea 0 retorna los sistemas padres.
     * @param integer $idnodo - Identificador del sistema | 0.
     * @return Doctrine_Collection.
     */
    public static function cargarsistema($idnodo)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if ($idnodo) {
            $sqlWhere ="idpadre = ? and idpadre <> idsistema and iddominio = ?";
            $filtro = array($idnodo, $iddominio);
        } else {
            $sqlWhere = "idpadre = idsistema and iddominio = ?";
            $filtro = $iddominio;
        }
        return Doctrine_Query::create()->select(
            's.idsistema id, s.denominacion text, s.descripcion descripcion, '
            . 's.icono icono, s.abreviatura abreviatura, s.idpadre idpadre, '
            . 's.externa, (s.rgt - s.lft = 1) as leaf, s.index index,'
            . 'f.idfuncionalidad idfuncionalidad, r.idrecurso idrecurso'
        )
            ->from('DatSistema s')
            ->leftjoin('s.DatFuncionalidad f ON (s.idsistema = f.idsistema)')
            ->leftjoin(
                'f.DatRecurso r ON (f.idfuncionalidad = r.idfuncionalidad)'
            )
            ->where($sqlWhere, $filtro)
            ->orderby('index')
            ->execute();
    }

    public static function cargarSistCompartimentados($idnodo) {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $nodo = substr($idnodo, 0, -2);
        if(strpos($nodo, '_'))
            $nodo = explode('_', $nodo)[0];
        if ($idnodo) {
            $sqlWhere ="s.idpadre = ? AND s.idpadre <> s.idsistema AND (sc.iddominio = ?)";
            $filtro = array($nodo, $iddominio);
        } else {
            $sqlWhere = "s.idpadre = s.idsistema AND (sc.iddominio = ?)";
            $filtro = array($iddominio);
        }

        return Doctrine_Query::create()
            ->select(
                's.idsistema id, s.denominacion text, s.descripcion descripcion, '
                . 's.icono icono, s.abreviatura abreviatura, s.idpadre idpadre, '
                . 's.externa, (s.rgt - s.lft = 1) as leaf, s.index index,'
            )
            ->from('DatSistema s')
            ->leftJoin('s.DatSistemaCompartimentacion sc ON (s.idsistema = sc.idsistema)')
            ->where($sqlWhere, $filtro)
            ->orderBy('index')
            ->execute();
    }

    /**
     * Retorna un listado de sistemas hijos, en caso de que el nodo inicial 
     * sea 0 retorna los sistemas padres.
     *
     * @method loadSystems
     * @param integer $idnodo - Identificador del sistema | 0.
     * @return array.
     */
    public static function loadSystems($idnodo)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $id = 0;
        if ($idnodo) {
            $sqlWhere = "s.iddominio = $iddominio AND s.idpadre = $idnodo "
                . "and s.idpadre <> s.idsistema";
            $id = $idnodo;
        } else
            $sqlWhere = "s.iddominio = $iddominio AND s.idpadre = s.idsistema";
        $sql = "SELECT s.idsistema || '_' || $id AS id, 
            s.idsistema AS idsistema, 'sistema' as type, s.denominacion as text
                FROM mod_seguridad.dat_sistema s WHERE ($sqlWhere) "
            . "ORDER BY s.idsistema";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }

    /**
     * Retorna un listado de sistemas hijos, en caso de que el nodo inicial
     *  sea 0 retorna los sistemas padres.
     *
     * @method loadSystems
     * @param integer $idnodo - Identificador del sistema | 0.
     * @return array.
     */
    public static function sistemasHijosDadoIdSistema($idnodo)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $id = 0;
        if ($idnodo) {
            $sqlWhere = "s.iddominio = $iddominio AND s.idpadre = $idnodo "
                . "and s.idpadre <> s.idsistema";
            $id = $idnodo;
        } else
            $sqlWhere = "s.iddominio = $iddominio AND s.idpadre = s.idsistema";
        $sql = "SELECT s.idsistema FROM mod_seguridad.dat_sistema s "
            . "WHERE ($sqlWhere) ORDER BY s.idsistema";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }

    /**
     * @method cargarSistemasCompartimentacion - Retorna un listado de sistemas 
     * compartimentados por dominios, en caso de que el nodo sea 0 retorna 
     * las raices.
     * @param integer $idnodo - Identificador del sistema | 0.
     * @param integer $iddominioComp - Identificador de dominio, diferente 
     * al de session.
     * @return Doctrine_Collection.
     */
    public static function cargarSistemasCompartimentacion(
        $idnodo, $iddominioComp
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if ($idnodo) {
            $sqlWhere = "s.idpadre = ? and s.idpadre <> s.idsistema "
                . "and s.iddominio = ? and sc.iddominio = ?";
            $filtro = array($idnodo, $iddominio, $iddominioComp);
        } else {
            $sqlWhere = "s.idpadre = s.idsistema and s.idsistema <> 0 "
                . "and s.iddominio = ? and sc.iddominio = ?";
            $filtro = array($iddominio, $iddominioComp);
        }
        return Doctrine_Query::create()->select(
            's.idsistema id, s.denominacion text, (s.rgt - s.lft = 1) '
            . 'as leaf, sc.idsistema as checked'
        )
            ->from('DatSistema s')
            ->leftJoin('s.DatSistemaCompartimentacion sc')
            ->where($sqlWhere, $filtro)
            ->orderby('idsistema')
            ->execute();
    }

    /**
     * @method cargarArbolSistemasCompartimentacion - Retorna un listado de 
     * sistemas compartimentados por dominios, en caso de que el nodo 
     * sea 0 retorna las raizes.
     * @param integer $idnodo - Identificador del sistema | 0.
     * @return Doctrine_Collection
     */
    public static function cargarArbolSistemasCompartimentacion($idnodo)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        if ($idnodo) {
            $sqlWhere = "s.idpadre <> s.idsistema and s.idpadre = ? "
                . "and sc.iddominio = ?";
            $filtro = array($idnodo, $iddominio);
        } else {
            $sqlWhere = "s.idpadre = s.idsistema and s.idsistema <> 0 "
                . "and sc.iddominio = ?";
            $filtro = array($iddominio);
        }
        return Doctrine_Query::create()->select(
            's.idsistema, s.idsistema id, s.denominacion text, '
            . '(s.rgt - s.lft = 1) as leaf'
        )
            ->from('DatSistema s')
            ->innerJoin(
                's.DatSistemaCompartimentacion sc ON s.idsistema = sc.idsistema'
            )
            ->where($sqlWhere, $filtro)
            ->orderby('idsistema')
            ->execute();
    }

    /**
     * @method cargarsistemasdelrol - Retorna un listado de sistemas que estan 
     * asociados a un rol y que son ihijos del nodo determinado, en caso de que
     *  el nodo sea 0 retorna las raices.
     * @param integer $idnodo - Identificador del sistema | 0.
     * @param integer $idrol - Identificador del rol.
     * @return array
     */
    public static function cargarsistemasdelrol($idnodo, $idrol)
    {
        if ($idnodo)
            return Doctrine_Query::create()->select(
                'DISTINCT (s.idsistema ) id, s.denominacion text,'
                . ' s.denominacion '
            )
                ->from('DatSistema s')
                ->innerJoin('s.DatSistemaSegRol sr')
                ->where(
                    "sr.idrol = ? "
                    . "and s.idpadre = ? "
                    . "and s.idsistema <> s.idpadre ", 
                    array($idrol, $idnodo)
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->orderby('idsistema')
                ->execute();
        else
            return Doctrine_Query::create()->select(
                'DISTINCT (s.idsistema ) id, s.denominacion text, '
                . 's.denominacion '
            )
                ->from('DatSistema s')
                ->innerJoin('s.DatSistemaSegRol sr')
                ->where(
                    "sr.idrol = ? "
                    . "and s.idpadre = s.idsistema "
                    . "and s.idsistema <> 0 ",
                    $idrol
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->orderby('idsistema')
                ->execute();
    }

    /**
     * @method obtenersistemas - Retirna un listado de sistemas padres que 
     * estan asociados a los roles determinados.
     * @param array $arrayIds - Arreglo de identificadores de rol.
     * @return array
     */
    public static function obtenersistemas($arrayIds)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (s.denominacion) text, s.denominacion, s.idsistema id, '
            . 's.descripcion, s.icono, s.externa, s.index'
        )
            ->from('DatSistema s')
            ->innerJoin('s.DatSistemaSegRol sr')
            ->where("s.idsistema = s.idpadre")
            ->whereIn('sr.idrol', $arrayIds)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('index')
            ->execute();
    }

    /**
     * @method verificarrolsistema - Verifica que unsistema pertenesca a un rol.
     * @param integer $idrol - Identificador del rol.
     * @param integer $idsistema - Identificador del sistema.
     * @return integer
     */
    public static function verificarrolsistema($idrol, $idsistema)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('COUNT(sr.idrol) idrol')
            ->from('DatSistemaSegRol sr')
            ->where(
                "sr.idrol = ? and sr.idsistema = ?", array($idrol, $idsistema)
            )
            ->execute();
        return $result[0]->idrol != 0;
    }

    /**
     * @method cargarsistemahijos - Retorna un listado de sistemas que son 
     * hijos de del sistema determinado y que además esten asociados a los 
     * roles pasados por parámetros.
     * @param integer $idsistema - Identificador del sistema.
     * @param array $arrayIds - Arreglo de identificadores de roles.
     * @return array
     */
    public static function cargarsistemahijos($idsistema, $arrayIds)
    {
        return Doctrine_Query::create()->select(
            's.denominacion text, s.idsistema id,s.idsistema,s.denominacion,'
            . 's.descripcion,s.icono,s.externa,s.index'
        )
            ->from('DatSistema s')
            ->innerjoin('s.DatSistemaSegRol sr ON s.idsistema = sr.idsistema')
            ->where("s.idpadre = ? AND s.idsistema <> s.idpadre", $idsistema)
            ->whereIn('sr.idrol', $arrayIds)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('s.index')
            ->execute();
    }

    /**
     * @method obtenersistemasxml - Retorna un listado de sistemas que esten 
     * asociados al rol seleccionado y que como padre tengan un sistema cuya 
     * abreviatura sea igual a la solicitada.
     * @param integer $idrol - Identificador del rol.
     * @param string $modulo - Abreviatura del sistema.
     * @return Doctrine_Collection
     */
    public static function obtenersistemasxml($idrol, $modulo)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (s.denominacion) text, s.denominacion, s.idsistema id,'
            . ' s.descripcion, s.icono,s.externa'
        )
            ->from('DatSistema s')
            ->innerJoin('s.DatSistemaSegRol sr ON s.idsistema = sr.idsistema')
            ->where(
                "sr.idrol = ? and s.abreviatura = ? "
                . "and s.idsistema = s.idpadre", 
                array($idrol, $modulo)
            )
            ->orderby('idsistema')
            ->execute();
    }

    /**
     * @method obtenersistemaexportarxml - Retorna un listado con los datos 
     * del sistema determinado, sin compartimentación.
     * @param integer $idsistema - Identificador del sistema.
     * @return array
     */
    public static function obtenersistemaexportarxml($idsistema)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (s.denominacion) text, s.denominacion, s.idsistema id, '
            . 's.descripcion, s.icono,s.externa'
        )
            ->from('DatSistema s')
            ->where("s.idsistema = ?", $idsistema)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->orderby('idsistema')
            ->execute();
    }

    /**
     * @method obtenersistemashijos - Retorna los hijos del sistema determinado,
     *  sin compartimentación.
     * @param integer $idsistema - Identificador del sistema.
     * @return Doctrine_Collection
     */
    public static function obtenersistemashijos($idsistema)
    {
        return Doctrine_Query::create()->select(
            'DISTINCT (s.denominacion) text, s.denominacion, s.idsistema id, '
            . 's.idsistema, s.descripcion, s.icono, s.externa'
        )
            ->from('DatSistema s')
            ->where("s.idpadre = ? and  s.idsistema <> s.idpadre", $idsistema)
            ->orderby('idsistema')
            ->execute();
    }

    /**
     * @method eliminarsistema - Función usada para eliminar un sistema. Si el 
     * sistema es padre los hijos serán eliminados según la restricción
     *  en la base de datos.
     * @param integer $idsistema - Identificador del sistema.
     * @return void
     */
    public static function eliminarsistema($idsistema)
    {
        Doctrine_Query::create()->delete()
            ->from('DatSistema')
            ->where("idsistema = ?", $idsistema)
            ->execute();
    }

    /**
     * @method buscarservidorweb - Retorna un listado con los datos del 
     * sistema donde sea igual al identificador pasado por parámetro.
     * @param integer $idpadre - Identificador de sistema.
     * @return Doctrine_Collection
     */
    public static function buscarservidorweb($idpadre)
    {
        return Doctrine_Query::create()->select('externa')
            ->from('DatSistema')
            ->where("idsistema = ?", $idpadre)
            ->execute();
    }

    /**
     * @method - Retorna la cantidad de sistemas que tengan la misma 
     * abreviatura y denominación.
     * @param string $denominacion - Denominación del sistema.
     * @param string $abreviatura - Abreviatura del sistema.
     * @return integer
     */
    public static function verificarsistema($denominacion, $abreviatura)
    {
        return Doctrine_Query::create()->from('DatSistema s')
            ->where(
                "s.denominacion = ? or s.abreviatura = ?", 
                array($denominacion, $abreviatura)
            )
            ->count();
    }

    /**
     * @method cantidadSistemasHijos - Retorna la cantidad de hijos que tiene 
     * un sistema determinado. Para ello se apoya en los Izq y Der 
     * del sistema determinado.
     * @param type $idpadre - Identificador del sistema.
     * @return integer
     */
    public static function cantidadSistemasHijos($idpadre)
    {
        $query = Doctrine_Query::create();
        $cantidad = $query->select('count(s.idsistema) cant')
            ->from('DatSistema s')
            ->where(
                "s.lft > (SELECT s1.lft FROM DatSistema s1 "
                . "WHERE s1.idsistema = ?) "
                . "AND s.rgt < (SELECT s2.rgt FROM DatSistema s2 "
                . "WHERE s2.idsistema = ?)", 
                array($idpadre, $idpadre)
            )
            ->execute();
        return $cantidad[0]->cant;
    }
    
    /**
     * @method getAllSistemasHijos - Retorna los hijos que tiene 
     * un sistema determinado. Para ello se apoya en los Izq y Der 
     * del sistema determinado.
     * @param type $idpadre - Identificador del sistema.
     * @return array
     */
    public static function getAllSistemasHijos($idpadre)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('s.idsistema')
            ->from('DatSistema s')
            ->where(
                "s.lft > (SELECT s1.lft FROM DatSistema s1 "
                . "WHERE s1.idsistema = ?) "
                . "AND s.rgt < (SELECT s2.rgt FROM DatSistema s2 "
                . "WHERE s2.idsistema = ?)", 
                array($idpadre, $idpadre)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * @method getIdsystemBydenominacion - Retorna el id del sistema
     * dada la denomiancion del mismo.
     * @param $denominacion
     * @return integer
     */
    public static function getIdsystemBydenominacion($denominacion)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('s.idsistema')
            ->from('DatSistema s')
            ->where("s.denominacion = '{$denominacion}' AND idsistema = idpadre")
            ->execute()
            ->getFirst()
            ->idsistema;
        return $result;
    }

    /**
     * @method verificarNombreSistema - Función usada para validar que no se 
     * repitan los nombres de los sistemas en los mismos niveles.
     * @param integer $idnodo - Identificador del sistema padre | 0.
     * @param string $denominacion - Denominación del sistema.
     * @param integer $idsistema - Identificador del sistema | 0.
     * @return integer
     */
    public static function verificarNombreSistema(
        $idnodo, $denominacion, $idsistema
    )
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $q = Doctrine_Query::create();
        if ($idnodo != 0) {
            if ($idnodo == $idsistema) {
                $sqlWhere = "idpadre = idsistema "
                    . "and iddominio = ? "
                    . "and denominacion = ?";
                $filtro = array($iddominio, $denominacion);
            } else {
                $sqlWhere = "idpadre = ? "
                    . "and idpadre <> idsistema "
                    . "and iddominio = ? "
                    . "and denominacion = ?";
                $filtro = array($idnodo, $iddominio, $denominacion);
            }

        } else {
            $sqlWhere = "idpadre = idsistema "
                . "and iddominio = ? "
                . "and denominacion = ?";
            $filtro = array($iddominio, $denominacion);
        }
        if ($idsistema) {
            $sqlWhere .= " AND idsistema <> ?";
            array_push($filtro, $idsistema);
        }
        $result = $q->select('count(idsistema) cant')
            ->from('DatSistema')
            ->where($sqlWhere, $filtro)
            ->execute();
        return $result[0]->cant;
    }
    /**
     * @method verificarSistemaUsoUsuario - Verifica que el sistema 
     * determinado no esté siendo usado por ningún usuario.
     * @param integer $idsistema - Identificador del sistema.
     * @return integer
     */
    public static function verificarSistemaUsoUsuario($idsistema)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('count(distinct idsistema) cant')
            ->from('DatSistema s')
            ->innerJoin('s.DatSistemaSegRol sr')
            ->innerJoin('sr.SegRol r')
            ->innerJoin('r.DatEntidadSegUsuarioSegRol eur')
            ->innerJoin('eur.SegUsuario u')
            ->where('s.idsistema = ? and u.activo = ?', array($idsistema, true))
            ->execute();
        return $datos[0]->cant;
    }

    /**
     * @method getSistemasPadres - Retorna un listado de todos los sistemas 
     * que se encuentren en la rama de un sistema determinado
     * @param integer $idsistema - Identificador del sistema.
     * @return array
     */
    public static function getSistemasPadres($idsistema)
    {
        return Doctrine_Query::create()->select('s.idsistema')
            ->from('DatSistema s')
            ->where(
                's.rgt >= (SELECT t.rgt FROM DatSistema t '
                . 'WHERE t.idsistema = ?) '
                . 'AND s.lft <= (SELECT w.lft '
                . 'FROM DatSistema w WHERE w.idsistema = ?)',
                array($idsistema, $idsistema)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @method getMyPadre - Retorna el padre del sistema
     *
     * @param integer $idsistema - Identificador del sistema.
     *
     * @return array
     */
    public static function getMyPadre($idsistema)
    {
        return Doctrine_Query::create()
            ->select('s.idpadre,s.denominacion')
            ->from('DatSistema s')
            ->where(
                's.idsistema = ?',
                array($idsistema)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Retorna un listado con los identificadores de sistemas que cumplan 
     * la condicion.
     * @param string $sql - SQL de isquierdo y derecho para obtener los padres.
     * @return array
     */
    public static function getIDSistemaBySql($sql)
    {
        return Doctrine_Query::create()->select('s.idsistema')
            ->from('DatSistema s')
            ->where($sql)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public static function getSistemasCohencidentes($texto)
    {
        $sql = "
        --Sistemas padres
        SELECT * FROM mod_seguridad.dat_sistema s
        WHERE s.idpadre = s.idsistema AND (s.denominacion LIKE '%$texto%' OR (
	    SELECT COUNT(sh.idsistema)
	    FROM mod_seguridad.dat_sistema sh
	    INNER JOIN mod_seguridad.dat_funcionalidad f 
            ON (f.idsistema = sh.idsistema)
	    INNER JOIN mod_seguridad.dat_accion a 
            ON (f.idfuncionalidad = a.idfuncionalidad)
	    WHERE s.lft <= sh.lft AND s.rgt >= sh.rgt AND (
		sh.denominacion LIKE '%$texto%' OR
		f.denominacion LIKE '%$texto%' OR
		a.denominacion LIKE '%$texto%'
	    )
        ) > 0);
        ";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }

    public static function getSistemasHijosCohencidentes($texto, $idsistema)
    {
        $sql = "
        --Sistemas hijos
        SELECT * FROM mod_seguridad.dat_sistema s
        WHERE s.idpadre <> s.idsistema AND
	    s.idpadre = $idsistema AND (
	    s.denominacion LIKE '%$texto%' OR (
		SELECT COUNT(sh.idsistema)
		FROM mod_seguridad.dat_sistema sh
		INNER JOIN mod_seguridad.dat_funcionalidad f 
                ON (f.idsistema = sh.idsistema)
		INNER JOIN mod_seguridad.dat_accion a 
                ON (f.idfuncionalidad = a.idfuncionalidad)
		WHERE s.lft <= sh.lft AND s.rgt >= sh.rgt AND (
			sh.denominacion LIKE '%$texto%' OR
			f.denominacion LIKE '%$texto%' OR
			a.denominacion LIKE '%$texto%'
		)
	    ) > 0);

        ";
        return Doctrine_Manager::getInstance()->getCurrentConnection()
            ->fetchAll($sql);
    }
    public static function getById($id) 
    {
        return Doctrine::getTable('DatSistema')->find($id);
    }
    /**
     * @access  public
     * @param
     * @return
     * @uses Para guardar el icono del menu de sistemas
     *
     */
    public static function guardarIconoSistemMenu($idsistem,$name)
    {
       /* echo 'sistema--',print_r($idsistem);
        echo 'icono--',print_r($name);die;*/

        $q = Doctrine_Query::create();
        return $q->update('DatSistema e')
            ->set('e.icono', "'$name'")
            ->where('e.idsistema = ?', $idsistem)
            ->execute();

    }
    static function guardarIconoFuncMenu($idfuncion,$name)
    {

        $q = Doctrine_Query::create();
        return $q->update('DatFuncionalidad a')
            ->set('a.icono', "'$name'")
            ->where('a.idfuncionalidad = ?', $idfuncion)
            ->execute();

    }

    public function actualizarIndiceSistema($idpadreNuevo, $indiceNuevo, $idpadreViejo, $idindiceViejo, $idsistema)
    {
//update dat_sistema set index = index + 1 where idpadre = $nuevoIdpadre and index >= $nuevoIndex
//update dat_sistema set index = index - 1 where idpadre = $viejoIdpadre and index > $viejoIndex

        if ($idsistema) {
            if ($idpadreNuevo) {
                $where1 = 's.idpadre = ? and s.index >= ? and s.idsistema <> ?';
                $filtro1 = array($idpadreNuevo, $indiceNuevo, $idsistema);
            } else {
                $where1 = 's.idpadre = s.idsistema and s.index >= ? and s.idsistema <> ?';
                $filtro1 = array($indiceNuevo, $idsistema);

            }
            if ($idpadreViejo) {
                $where2 = 's.idpadre = ? and s.index >= ? and s.index <> 0 and s.idsistema <> ? and s.idsistema <> ?';
                $filtro2 = array($idpadreViejo, $idindiceViejo, $idsistema, $idpadreViejo);
            } else {
                $where2 = 's.idpadre = s.idsistema and s.index >= ? and s.index <> 0 and s.idsistema <> ?';
                $filtro2 = array($idindiceViejo, $idsistema);
            }


        } else {
            if ($idpadreNuevo) {
                $where1 = 's.idpadre = ? and s.index >= ?';
                $filtro1 = array($idpadreNuevo, $indiceNuevo);
            } else {
                $where1 = 's.idpadre = s.idsistema and s.index >= ?';
                $filtro1 = array($indiceNuevo);
            }
            if ($idpadreViejo) {
                $where2 = 's.idpadre = ? and s.index >= ? ';
                $filtro2 = array($idpadreViejo, $idindiceViejo);
            } else {
                $where2 = 's.idpadre = s.idsistema and s.index >= ? ';
                $filtro2 = array($idindiceViejo);
            }


        }
        if ($idpadreViejo == $idpadreNuevo) {
            $q = Doctrine_Query::create();
            return $q->update('DatSistema s')
                ->set('s.index', 's.index + 1')
                ->where($where1, $filtro1)
                ->execute();
        } else {
            //en los del nuevo padre adiciono
            self::adicionarIndiceSubsistema($where1, $filtro1);

            //en los del viejo padre resto
            self::restarIndiceSubsistema($where2, $filtro2);

        }


    }

    public function adicionarIndiceSubsistema($where1, $filtro1)
    {
        $q = Doctrine_Query::create();
        return $q->update('DatSistema s')
            ->set('s.index', 's.index + 1')
            ->where($where1, $filtro1)
            ->execute();

    }

    public function restarIndiceSubsistema($where2, $filtro2)
    {
        $query = Doctrine_Query::create();
        return $query->update('DatSistema s')
            ->set('s.index', 's.index - 1')
            ->where($where2, $filtro2)
            ->execute();

    }
}
