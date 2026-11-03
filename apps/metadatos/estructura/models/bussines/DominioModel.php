<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DominioModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomDominio();
    }

    /**
     * Inserta un dominio nuevo
     *
     * @autor Seguridad
     *
     *
     * @param string $nombre
     * @param        $descripcion
     * @param        $arrayEstructuras
     *
     * @return id dominio.
     */
    public function InsertarDominio($nombre, $descripcion, $arrayEstructuras)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $idDominio = $this->buscaridproximo();
        $idpadre = $this->global->Perfil->iddominio;
        $conn->beginTransaction();
        $conn->execute(
            "INSERT INTO mod_estructuracomp.nom_dominio
						(iddominio,denominacion,descripcion,dominio,idpadre) values
						($idDominio,'$nombre','$descripcion','{1}', '$idpadre') "
        );
        $conn->commit();
        $this->actualizarBinarios($conn, $idDominio, $arrayEstructuras);

        return $idDominio;
    }

    /**
     * Inserta un dominio nuevo
     *
     * @autor Seguridad
     *
     * @param        $iddominio
     * @param string $nombre
     * @param        $descripcion
     * @param        $arrayEstructuras
     *
     * @return id dominio.
     */
    public function ModificarDominio($iddominio, $nombre, $descripcion, $arrayEstructuras)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $sqlActualiza = "UPDATE mod_estructuracomp.nom_dominio
						   	SET
									dominio      = '{1}' ,
									denominacion = '$nombre' ,
									descripcion  = '$descripcion'
							WHERE iddominio    = '$iddominio' ";
        $conn->execute($sqlActualiza);
        $this->actualizarBinarios($conn, $iddominio, $arrayEstructuras);

        return true;
    }

    /**
     * Obtener los hijos de un arreglo de estructura
     *
     * @author    : Seguridad
     *
     * @param            $idacceso
     * @param            $iddominio
     * @param bool $idestructura
     * @param bool $checked
     * @param array|bool $arrayIdestructura
     *
     * @return array
     */
    function buscarHijosEstructurasDadoArray(
        $idacceso, $iddominio, $idestructura = false, $checked = false, $arrayIdestructura = array()
    )
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        if ($idacceso) {
            $checked = "
            CASE
                WHEN accesofila[$idacceso] = 1 :: bit THEN true
                WHEN fila.idconcepto <> 2 AND fila.idconcepto <> 6 THEN false
            END AS checked,";
        } else {
            $checked = ($checked) ? 'false AS checked,' : '';
        }
        $sqlWhere
            = ($idestructura)
            ? "fila.idpadre='$idestructura' AND fila.idfila<>fila.idpadre "
            : "fila.idfila = fila.idpadre";
        $case
            = "CASE
                         when estructura.denominacion <> '' then estructura.denominacion
                         when estructuraop.denominacion <> '' then estructuraop.denominacion
                     END as text";
        $sqlLeaf
            = "
                SELECT COUNT(l.idfila)
                FROM mod_estructuracomp.nom_filaestruc as l
                WHERE l.parent_path operator (public.<@) fila.parent_path AND l.idconcepto <= 8";
        $sqlNuevo = "
              SELECT fila.idfila as id,fila.idpadre as _parent, $checked
                     fila.dominiofila[$iddominio] = 0 :: bit as unchecked,

                      icono.icono AS icon,
                     CASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = fila.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf,
                                        $case
              FROM mod_estructuracomp.nom_filaestruc fila
              INNER JOIN mod_estructuracomp.nom_concepto nomeav
                  ON fila.idconcepto = nomeav.idconcepto
              INNER JOIN mod_estructuracomp.nom_icono icono
                  ON icono.idicono = nomeav.idicono
              LEFT JOIN  mod_estructuracomp.dat_estructura estructura
                  ON ( estructura.idestructura = fila.idfila AND estructura.idproyecto = 0 )
              LEFT JOIN  mod_estructuracomp.dat_estructuraop estructuraop
                  ON ( estructuraop.idestructuraop = fila.idfila  AND estructuraop.idproyecto = 0)
              LEFT JOIN  mod_estructuracomp.nom_organo orgest
                  ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto )
              LEFT JOIN  mod_estructuracomp.nom_organo orgestop
                  ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto   )
              WHERE $sqlWhere
                    AND fila.fechafin is null
                    AND (estructura.denominacion <> '' OR estructuraop.denominacion <> '')
                    AND (fila.dominiofila[$iddominio] = 1 :: bit
                         OR ( SELECT COUNT(otros.idfila) > 0
                              FROM mod_estructuracomp.nom_filaestruc otros
                              WHERE $sqlWhere
                                    AND otros.dominiofila[$iddominio] = 1 :: bit
                                    AND otros.parent_path operator (public.<@) fila.parent_path 
                                    
                             )
                          )
              ORDER BY fila.orden";
        $resultado = $conn->fetchAll($sqlNuevo);

        return $resultado;
    }

    /**
     * Retorna un listado de identificadores de estructura hijos de la estructura dada por parametros
     * a las cuales tiene acceso el usuario logueado en el sistema dentro de su dominio.
     *
     * @param         $arrayIdAcceso
     * @param integer $identidad Identificador de la estructura.
     *
     * @return array Listado de identificadores de estructura.
     */
    public function obtenerListadoIdEstructura($arrayIdAcceso, $identidad)
    {
        $sqlAccess = "";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        if (count($arrayIdAcceso) > 0) {
            $sqlAccess = self::getSqlAccess($arrayIdAcceso);
        }
        $query = "SELECT idfila as id

                    FROM mod_estructuracomp.nom_filaestruc fila

                    WHERE fila.fechafin IS NULL AND

                        (fila.lft >= (
                                        SELECT f1.lft
                                        FROM mod_estructuracomp.nom_filaestruc f1
                                        WHERE f1.idfila = $identidad) AND

                        fila.lft <= (
                                        SELECT f1.rgt
                                        FROM mod_estructuracomp.nom_filaestruc f1
                                        WHERE f1.idfila = $identidad)

                    ) AND $sqlAccess

                    ORDER BY fila.idconcepto ASC";

        return $conn->fetchAll($query);
    }

    /**
     * Funcion usada para retornar los identificadores de identidades a los que un usuario tiene acceso segun el rol
     *
     * @param type $idacceso - Identificador del bit de acceso.
     *
     * @return array Listado de identificadores de estructura.
     */
    public function obtenerListadoEntidadesUsuarioRol($idacceso)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "SELECT f.idfila FROM nom_filaestruc f WHERE f.fechafin IS NULL AND  f.accesofila[$idacceso] = 1 :: bit";

        return $conn->fetchAll($sql);
    }

    /**
     * Elimina un dominio
     *
     * @autor Seguridad
     *
     * @param int $iddominio
     *
     * @return bool
     */
    public function EliminarDominio($iddominio)
    {
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $query = Doctrine_Query::create();
            $result = $query->delete('iddominio')->from('NomDominio')->where("iddominio = '$iddominio'")->execute();
            $conn->execute(
                "UPDATE nom_filaestruc
                            SET  dominiofila[$iddominio] = 0::bit
                            WHERE dominiofila[$iddominio] = 1::bit"
            );

            return $result != 0;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__FILE__ . ' ' . __LINE__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * Lista todos los dominios existentes en un rango especificado
     *
     * @autor Seguridad
     *
     * @param     $limit
     * @param int $start
     * @param     $arrayResult
     *
     * @return array
     */
    public function BuscarDomios($limit, $start, $arrayResult)
    {
        $q = Doctrine_Query::create();
        $resultTotal = $q->select('count(iddominio) as cant')->from('NomDominio')->whereIn('iddominio', $arrayResult)
            ->execute();
        $result = $q->select('d.iddominio, d.denominacion, d.seguridad, d.descripcion')->from('NomDominio d')->whereIn(
            'd.iddominio', $arrayResult
        )->limit($limit)->offset($start)->orderBy('d.denominacion')->fetchArray();

        return array('cant' => $resultTotal[0]->cant, 'datos' => $result);
    }

    /**
     * Cargar el combo de los dominios
     *
     * @autor Seguridad
     *
     * @param $filtroDominio
     *
     * @return array
     */
    public function cargarComboDominioBuscar($filtroDominio)
    {
        $q = Doctrine_Query::create();
        $resultTotal = $q->select('count(iddominio) as cant')->from('NomDominio')->whereIn(
            'iddominio', $filtroDominio
        )->execute();
        $result = $q->select('d.iddominio, d.denominacion, d.descripcion')->from('NomDominio d')->whereIn(
            'd.iddominio', $filtroDominio
        )->fetchArray();

        return array('cant' => $resultTotal[0]->cant, 'datos' => $result);
    }

    /**
     * Retorna los hijos del dominio
     *
     * @autor Seguridad
     * @return Doctrine_Collection
     */
    public function BuscarIdDominioHijos()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $q = Doctrine_Query::create();
        $result = $q->select('d.iddominio')->from('NomDominio d')->where('d.idpadre = ?', $iddominio)->setHydrationMode(
            Doctrine :: HYDRATE_ARRAY
        )->execute();

        return $result;
    }

    /**
     * Retorna los padres del dominio
     *
     * @autor Seguridad
     * @return Doctrine_Collection
     */
    public function BuscarIdDominioPadre()
    {
        $iddominio = $this->global->Perfil->iddominio;
        $q = Doctrine_Query::create();
        $result = $q->select('d.iddominio')->from('NomDominio d')->where('d.iddominio = ?', $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $result;
    }

    /**
     * Lista todos los dominios existentes en un rango especificado
     *
     * @autor Seguridad
     *
     * @param     $limit
     * @param int $start
     *
     * @return array
     */
    function BuscarDominios($limit, $start)
    {
        $idpadre = $this->global->Perfil->iddominio;
        $q = Doctrine_Query::create();
        $resultTotal = $q->select('count(iddominio) as cant')->from('NomDominio')->where(
            "idpadre= ? and iddominio <> idpadre", $idpadre
        )->execute();
        $result = $q->select('d.iddominio, d.denominacion, d.seguridad, d.descripcion')->from('NomDominio d')->where(
            "d.idpadre= ? and d.iddominio <> d.idpadre", $idpadre
        )->limit($limit)->offset(
            $start
        )->orderBy('d.iddominio')->fetchArray();

        return array('cant' => $resultTotal[0]->cant, 'datos' => $result);
    }

    /** -----------------------------------------
     * Buscar el proximo id a escribir
     *
     * @return int
     */
    public function buscaridproximo()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $query = Doctrine_Query::create($conn);
        // eliminar el campo
        $result = $query->select('max(a.iddominio) as maximo')->from('NomDominio a')->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

        return $proximo;
    }

    /**
     * Retorna los datos del dominio
     *
     * @author    : Seguridad
     * @return array : mixed
     */
    public function BuscarIdDominioSeguridad()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('a.iddominio')->from('NomDominio a')->where('a.seguridad = 1')->execute()->toArray();

            return $result[0]['iddominio'];
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                die(__FILE__ . ' ' . __LINE__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * Retorna el arbol de dominio
     *
     * @author Seguridad.
     *
     * @param $iddominio
     *
     * @return array
     */
    function cargarArbolDominios($iddominio)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $iddominiousuario = $this->global->Perfil->iddominio;
        if ($iddominio) {
            $where = "idpadre = $iddominio and idpadre <> iddominio";
        } else {
            if ($iddominiousuario == 1) {
                $where = "idpadre = iddominio and iddominio = $iddominiousuario";
            } else {
                $where = "iddominio = $iddominiousuario";
            }
        }
        $sql = "SELECT
				  dominio.iddominio AS id,
				  dominio.iddominio,
				  dominio.denominacion AS text,
				  false as checked,
				  dominio.rgt - dominio.lft = 1 as leaf
				  FROM mod_estructuracomp.nom_dominio dominio
				  where $where";
        $arbolDominio = $conn->fetchAll($sql);

        return $arbolDominio;
    }

    /**
     * Lista las estructuras del dominio en las que un usuario determinado tenga acceso.
     *
     * @author Seguridad.
     *
     * @param $arrayPadres
     *
     * @return array Retorna un listado con de estructuras.
     */
    function buscarArbolHijosDominio($arrayPadres)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $primero = true;
        foreach ($arrayPadres as $id) {
            if ($primero) {
                $sqlWhere = "((dominio.lft > (select d.lft from nom_dominio d where d.iddominio = $id)
				and dominio.lft < (select d.rgt from nom_dominio d where d.iddominio = $id))";
                $primero = false;
            } else {
                $sqlWhere .= "or (dominio.lft > (select d.lft from nom_dominio d where d.iddominio = $id)
				and dominio.lft < (select d.rgt from nom_dominio d where d.iddominio = $id))";
            }
        }
        if ($sqlWhere) {
            $sqlWhere .= ')';
        }
        $sql = "select distinct dominio.iddominio,
				dominio.denominacion
				from nom_dominio dominio
				where
				$sqlWhere";
        $arreglo = $conn->fetchAll($sql);

        return $arreglo;
    }

    /**
     * Devuelve los id de las estructuras que pertenecen al dominio
     *
     * @author    : Seguridad
     *
     * @param $iddominio
     *
     * @internal  param int $idestructura
     * @return array
     */
    function arregloEstructuras($iddominio)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $arregloPermiso = $conn->fetchAll(
            'select idfila FROM mod_estructuracomp.nom_filaestruc fila where
                                            fila.fechafin IS NULL AND fila.dominiofila[' . $iddominio . '] = 1 :: bit'
        );
        $elementos = array();
        foreach ($arregloPermiso as $idfila) {
            $elementos[] = $idfila['idfila'];
        }

        return $elementos;
    }

    /**
     * Obtener los hijos de una estructura
     *
     * @author    : Seguridad
     *
     * @param $arrayPadres
     *
     * @return array
     */
    function buscarArbolHijosEstructuras($arrayPadres)
    {
        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $primero = true;
        foreach ($arrayPadres as $id) {
            if ($primero) {
                $sqlWhere = "and ((fila.lft > (select f.lft from nom_filaestruc f where f.idfila = $id)
				and fila.lft < (select f.rgt from nom_filaestruc f where f.idfila = $id))";
                $primero = false;
            } else {
                $sqlWhere .= "or (fila.lft > (select f.lft from nom_filaestruc f where f.idfila = $id)
				and fila.lft < (select f.rgt from nom_filaestruc f where f.idfila = $id))";
            }
        }
        if ($sqlWhere) {
            $sqlWhere .= ')';
        }
        $sql = "select distinct fila.idfila as idestructura
				from nom_filaestruc fila
				where fila.fechafin IS NULL AND
				fila.dominiofila[ '$iddominio'] = 1 :: bit
				$sqlWhere";
        $arreglo = $conn->fetchAll($sql);

        return $arreglo;
    }

    /**
     * Obtener los hijos de una estructura por seguridad
     *
     * @author    : Seguridad
     *
     * @param bool $iddominiopermiso
     * @param bool $idestructura
     * @param bool $checked
     *
     * @return array
     */
    function buscarHijosEstructuras(
        $iddominiopermiso = false, $idestructura = false, $checked = false
    )
    {
        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        // verificar el dominio con el cual se va a trabajar
        $iddominio = $iddominio ? $iddominio : 1;
        if ($iddominiopermiso) {
            $checked = ($checked) ? "COALESCE((
                                     select(nom_filaestruc.dominiofila['$iddominiopermiso'] = 1 :: bit)
                                     from  nom_filaestruc
                                     where nom_filaestruc.idfila = fila.idfila),false) as checked," : '';
        } else {
            $checked = ($checked) ? 'false as checked,' : '';
        }
        $idpadreSQL = 'fila.idpadre';
        $sqlWhere
            = ($idestructura)
            ? "$idpadreSQL = '$idestructura' AND fila.idfila <> $idpadreSQL "
            : "fila.idfila
            = $idpadreSQL";
        $case
            = "CASE
                      when nomcargo.denominacion <> '' then nomcargo.denominacion
                      when estructura.denominacion <> '' then estructura.denominacion
                      when estructuraop.denominacion <> '' then estructuraop.denominacion
                      when nommedio.denominacion <> '' then nommedio.denominacion
								    END as text,
		        CASE
		              when estructura.codigo <> '' then estructura.codigo
		                END as codigo";
        $join
            = "
                    INNER JOIN mod_estructuracomp.nom_concepto nomeav
                        ON (fila.idconcepto = nomeav.idconcepto)
                    INNER JOIN mod_estructuracomp.nom_icono icono
                        ON (icono.idicono = nomeav.idicono)
                    LEFT JOIN mod_estructuracomp.dat_estructura estructura
                        ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0 )
                    LEFT JOIN mod_estructuracomp.nom_organo orgest
                        ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto )
                    LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                        ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0)
                    LEFT JOIN mod_estructuracomp.nom_organo orgestop
                        ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto   )
                    LEFT JOIN mod_estructuracomp.dat_medio  medio
                        ON ( medio.idmedio = fila.idfila AND medio.idproyecto =0 )
							      LEFT JOIN mod_datosmaestros.nom_indicador  nommedio
							          ON ( nommedio.idindicador = medio.idnommedio )
							      LEFT JOIN mod_estructuracomp.dat_cargo  cargo
							          ON ( cargo.idcargo = fila.idfila AND cargo.idproyecto =0 )
							      LEFT JOIN mod_estructuracomp.dat_cargocivil cargociv
							          ON (cargo.idcargo = cargociv.idcargo AND cargociv.idproyecto =0)
							      LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom
							          ON (cargo.idcargo = cargom.idcargo AND cargom.idproyecto =0)
							      LEFT JOIN mod_estructuracomp.nom_cargo nomcargo
							          ON (  cargo.idnomcargo = nomcargo.idnomcargo )
                    ";
        $militar
            = "
                SELECT icono
          FROM mod_estructuracomp.nom_icono i
          INNER JOIN mod_estructuracomp.nom_concepto nomeav on (nomeav.idicono = i.idicono)
          where nomeav.idconcepto = 10
      ";
        $a = "
        SELECT idfila as id,
               fila.idconcepto as tipo,
               CASE
                   when cargom.idcargo is not null then
                  ($militar)
                  else
                  icono.icono
               END AS icon,
               $checked
               fila.dominiofila[$iddominio] = 0 :: bit as unchecked,
               fila.idpadre as _parent,
               CASE
                  WHEN (
                        SELECT COUNT(idfila)
                        FROM mod_estructuracomp.nom_filaestruc
                        WHERE idpadre = fila.idfila AND idpadre <> idfila
                        ) = 0
                  then true else false
                END AS leaf,
               $case
               FROM mod_estructuracomp.nom_filaestruc fila
               $join
               WHERE (fila.fechafin is null)
                    AND (estructura.denominacion <> '' OR estructuraop.denominacion <> '' OR nomcargo.denominacion <>
                    '' OR nommedio.denominacion <>
                    '')
                    AND $sqlWhere
                    AND (fila.dominiofila[$iddominio] = 1 :: bit
                    OR (
                        SELECT COUNT(DISTINCT f.idfila)
                        FROM mod_estructuracomp.nom_filaestruc f
                        WHERE (f.parent_path  operator (public.<@) fila.parent_path)
                    AND (f.fechafin is null)
                    AND f.dominiofila[$iddominio] = 1 :: bit) > 0)
               ORDER BY fila.orden";
        $resultado = $conn->fetchAll($a);
        return $resultado;
    }

    /**
     * Obtener los hijos de una estructura por seguridad de forma lineal
     *
     * @author    : Seguridad
     *
     * @param bool $iddominiopermiso
     * @param bool|string $idestructura
     * @param bool $checked
     *
     * @return array
     */
    function buscarHijosEstructurasLineal(
        $iddominiopermiso = false, $idestructura = '', $checked = false,$checkear = false,$arrayExcluir = false
    )
    {
        $whereExclude =(is_array($arrayExcluir)) ? implode(',', $arrayExcluir) : '0';

        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $icon = "true as icono";
        // verificar el dominio con el cual se va a trabajar
        $iddominio = $iddominio ? $iddominio : 1;
        if ($iddominiopermiso) {
            $checked = ($checked) ? "(select(nom_filaestruc.dominiofila['$iddominiopermiso'] = 1 :: bit)
								from  nom_filaestruc
								where
								 nom_filaestruc.idfila = fila.idfila) as checked," : '';
        } else {
            $checked = ($checked) ? 'false as checked,' : '';
        }
        if ($idestructura != "") {
            $case
                = "CASE
						when nomcvil.denominacion <> '' then nomcvil.denominacion
						when estructura.denominacion <> '' then estructura.denominacion
						when estructuraop.denominacion <> '' then estructuraop.denominacion
					END as text";
            $join
                = "
                    INNER JOIN mod_estructuracomp.nom_concepto nomeav
                        ON (fila.idconcepto = nomeav.idconcepto)
                    INNER JOIN mod_estructuracomp.nom_icono icono
                        ON (icono.idicono = nomeav.idicono)
                    LEFT JOIN mod_estructuracomp.dat_estructura estructura
                        ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0)
                    LEFT JOIN  mod_estructuracomp.nom_organo orgest
                        ON (orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                        ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0)
                    LEFT JOIN  mod_estructuracomp.nom_organo orgestop
                        ON (orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto)
                    LEFT JOIN mod_estructuracomp.dat_cargo cargo
                        ON (cargo.idcargo = fila.idfila AND cargo.idproyecto =0)
					          LEFT JOIN mod_estructuracomp.nom_cargo nomcvil
					              ON (cargo.idnomcargo = nomcvil.idnomcargo )
                    ";
            $newwhere = ' fila.idfila<>fila.idpadre';
            $newwhere .= " and (fila.lft > (select lft from nom_filaestruc where idfila = $idestructura) AND fila.rgt <
                            (select rgt from nom_filaestruc where idfila = $idestructura) AND fila.fechafin is null) And fila.idconcepto NOT IN ($whereExclude) ";
            $sqlresult = "select idfila as id, icono.icono as icon,
				$checked
				fila.dominiofila[$iddominio] = 0 :: bit as unchecked,
				fila.idpadre as _parent,
				$icon,
				fila.rgt - fila.lft = 1 as leaf,
				$case
				FROM mod_estructuracomp.nom_filaestruc fila
				 $join
				 where $newwhere AND fila.fechafin IS NULL order by(fila.orden)";
            $result = $conn->fetchAll($sqlresult);

            return $result;
        } else {
            echo("{'codMsg':3,'mensaje': 'No se ha seleccionado ninguna estructura.'}");
        }
    }

    /**
     * Obtener los hijos de un arreglo de estructura
     *
     * @author    : Seguridad
     *
     * @param      $iddominio
     * @param bool $arrayIdestructura
     * @param      $tipoEAV
     * @param      $idnomeav
     *
     * @return array
     */
    function buscarIdEstructurasDominio($iddominio, $arrayIdestructura, $tipoEAV, $idnomeav = 0)
    {
        if (!$iddominio) {
            $iddominio = $this->global->Perfil->iddominio;
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        //Externas
        if ($tipoEAV == 1) {
            $case = "estructura.denominacion as text";
            $join
                = "INNER JOIN mod_estructuracomp.dat_estructura estructura
                    ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0 )";
        } elseif ($tipoEAV == 2) {
            $case = "estructuraop.denominacion as text";
            $fidnomeav = ($idnomeav) ? " AND estructuraop.idconcepto = $idnomeav" : '';
            $join = "INNER JOIN mod_estructuracomp.dat_estructuraop estructuraop
                    ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0 $fidnomeav)";
        } else {
            $case
                = "
        CASE
            WHEN estructura.denominacion <> '' THEN estructura.denominacion
                        WHEN estructuraop.denominacion <> '' THEN estructuraop.denominacion
                END AS text";
            $join
                = "LEFT JOIN mod_estructuracomp.dat_estructura estructura
                    ON (fila.idfila = estructura.idestructura )
                    LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                        ON (fila.idfila = estructuraop.idestructuraop )";
        }
        $where = '';
        if (count($arrayIdestructura)) {
            $where .= " AND (";
            foreach ($arrayIdestructura as $key => $value) {
                $where .= ($key != 0) ? " OR accesofila[$value] = 1::bit" : "accesofila[$value] = 1::bit";
            }
            $where .= ")";
        }
        $sql = "SELECT DISTINCT fila.idfila, fila.idfila as idestructura,
                $case
                FROM mod_estructuracomp.nom_filaestruc fila
                $join
                WHERE  fila.fechafin is null AND fila.dominiofila[$iddominio] = 1 :: bit
                $where";

        return $conn->fetchAll($sql);
    }

    /**
     * Obtener los hijos de un arreglo de estructura
     *
     * @author    : Seguridad
     *
     * @param      $iddominio
     * @param bool $arrayIdestructura
     * @param      $tipoEAV
     *
     * @return array
     */
    function cantIdEstructurasDominio($iddominio, $arrayIdestructura, $tipoEAV)
    {
        if (!$iddominio) {
            $iddominio = $this->global->Perfil->iddominio;
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        //Externas
        if ($tipoEAV == 1) {
            $join
                = "INNER JOIN mod_estructuracomp.dat_estructura estructura
                ON (fila.idfila = estructura.idestructura AND estructura.idproyecto = 0)";
        } elseif ($tipoEAV == 2) {
            $join
                = "INNER JOIN mod_estructuracomp.dat_estructuraop estructuraop
                ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto = 0 )";
        } else {
            $join
                = "LEFT JOIN mod_estructuracomp.dat_estructura estructura
                      ON (fila.idfila = estructura.idestructura )
                LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                      ON (fila.idfila = estructuraop.idestructuraop )";
        }
        if (count($arrayIdestructura)) {
            $where = "and idfila in (" . implode(',', $arrayIdestructura) . ")";
        } else {
            $where = '';
        }
        $sql = "select count(fila.idfila) as cant
				from nom_filaestruc fila
				$join
				where fila.fechafin is null AND
				 fila.dominiofila[$iddominio] = 1 :: bit
				$where ";

        return $conn->fetchAll($sql);
    }

    /** --------------------------------------------
     * Borrar la instancia vieja que poseia el modelo
     */
    public function Instancia()
    {
        $this->instance = null;
        $this->instance = new NomDominio();
    }

    /**
     * Extrae una extructura de un dominio
     *
     * @author    : Seguridad
     *
     * @param int $iddominio
     * @param int $idestructura
     *
     * @return bool
     */
    public function ExtraerEstructura($iddominio, $idestructura)
    {
        $this->instance = Doctrine::getTable('NomDominio')->find($iddominio);
        $elementos = $this->arregloEstructuras($iddominio);
        if (($posicion = array_search($idestructura, $elementos)) !== false) {
            unset($elementos[$posicion]);
            $this->instance->dominiostring = implode(',', $elementos);
        } else {
            return false;
        }
        try {
            $this->instance->save();

            return true;
        } catch (Doctrine_Exception $ee) {
            if (DEBUG_ERP) {
                echo(__FILE__ . ' ' . __LINE__ . ' ' . $ee->getMessage());
            }

            return false;
        }
    }

    /**
     * Verificar si esta la estructura en un dominio dado
     *
     * @author    : Seguridad
     *
     * @param int $iddominio
     * @param int $idestructura
     *
     * @return bool
     */
    public function perteneceEstructura($iddominio, $idestructura)
    {
        $elementos = $this->arregloEstructuras($iddominio);
        if (array_search($idestructura, $elementos) !== false) {
            return true;
        }

        return false;
    }

    /**
     * @author Darien Garcia Tejo.
     *
     * @param type $iddominio - Identificador del dominio del usuario autenticado.
     * @param      $sql
     *
     * @return Listado de entidades que pertenecen a los roles del usuario.
     */
    public function getIdsEntityByRoleIndex($iddominio, $sql)
    {
        return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll(
            "SELECT idfila FROM nom_filaestruc
                              WHERE (dominiofila[$iddominio] = 1 :: bit AND ($sql));"
        );
    }

    /**
     * Devuelve los dominios en los que esta contenido una estructura pasada por parametro
     *
     * @author    : Seguridad
     *
     * @param int $idestructura
     *
     * @return array
     */
    function DominiosPorEstructura($idestructura)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $sql = "
      SELECT dominio.*
      FROM mod_estructuracomp.nom_filaestruc fila,mod_estructuracomp.nom_dominio dominio
      where fila.fechafin is null AND  fila.idfila = $idestructura AND fila.dominiofila[dominio.iddominio] = 1 :: bit";
        $arregloPermiso = $conn->fetchAll($sql);

        return $arregloPermiso;
    }

    /**
     * Retorna los datos del dominio
     *
     * @author    : Seguridad
     *
     * @param $iddominio , id del elemento a saber si esta en uso
     *
     * @return array : mixed
     */
    public function DatosDominioDadoID($iddominio)
    {
        $q = Doctrine_Query::create();
        $result = $q->from('NomDominio d ')->where("d.iddominio = ?", $iddominio)->execute();
        $resultado = $result->toArray();

        return $resultado;
    }

    /**
     * Actualizar vectores de dominios de las estructuras.
     *
     * @author    : Seguridad
     * @modifier  : Ing.Osvaldo Manuel Gonzalez Ortiz
     * @modifier  : Ing.Javier Limonta
     *
     * @param Doctrine_Connection_Pgsql $conn Conexion del componente EyC a base de datos.
     * @param int $idDominio Identificador de dominio.
     * @param array $arrayEstructuras Arreglo multidimensional de estructuras
     */
    private function actualizarBinarios($conn, $idDominio, $arrayEstructuras)
    {
        //Uniendo los arreglos de elementos a insertar y convirtiendolos para los where
        $arrayInsertar = array_merge($arrayEstructuras['estructuras'], $arrayEstructuras['padres']);
        //Uniendo los arreglos de elementos a eliminar y convirtiendolos para los where
        $arrayEliminar = array_merge(
            $arrayEstructuras['arrayPadresEliminar'], $arrayEstructuras['arrayEntidadesEliminar']
        );
        $idEstructurasEliminar = implode(',', $arrayEliminar);
        //Comprobando que existen elementos a insertar
        if (count($arrayInsertar) > 0) {
            //Eliminando de la busqueda de estructuras las especificadas a eliminar sus dominios
            $notIn = (count($arrayEliminar) > 0) ? " AND f.idfila NOT IN ($idEstructurasEliminar)" : '';
            /**
             * Consulta para la obtencion de los rangos de izq y derecho de las estructuras que son padres y no
             * esten marcadas para ser eliminadas
             */
            $sqlWHERE = ' ';
            $i = 0;
            foreach ($arrayEstructuras['padres'] as $index => $padres) {
                $filas = $conn->fetchAll(
                    "
                    SELECT parent_path
                    FROM nom_filaestruc f
                    WHERE f.idfila = $padres $notIn"
                );
                $parent_path = $filas[0]['parent_path'];
                //Condiciones para la captura de los hijos y los padres de las estructuras especificadas a insertar.
                if ($i == count($arrayEstructuras['padres']) - 1) {

                    $sqlWHERE .= "(parent_path operator (public.<@) '$parent_path')";
                } else {
                    $sqlWHERE .= "(parent_path operator (public.<@) '$parent_path') OR";
                }
                $i += 1;
            }
            /**
             * Consulta para la obtencion de los rangos de izq y derecho de las estructuras seleccionadas
             * para marcas a sus padres en el dominio
             */
            $sqlWHEREPadres = (count($arrayEstructuras['padres']) > 0 && count($arrayEstructuras['estructuras']) > 0) ? ' OR
                ' : ' ';
            $i = 0;
            foreach ($arrayEstructuras['estructuras'] as $index => $estructuras) {
                $filas = $conn->fetchAll(
                    "
                    SELECT parent_path
                    FROM nom_filaestruc f
                    WHERE f.idfila = $estructuras $notIn"
                );
                //Condiciones para la captura de los hijos y los padres de las estructuras especificadas a insertar.
                $parent_path = $filas[0]['parent_path'];
                //Condiciones para la captura de los hijos y los padres de las estructuras especificadas a insertar.
                if ($i == count($arrayEstructuras['estructuras']) - 1) {

                    $sqlWHEREPadres .= "(parent_path operator (public.@>) '$parent_path')";
                } else {
                    $sqlWHEREPadres .= "(parent_path operator (public.@>) '$parent_path') OR";
                }
                $i += 1;
            }
            $query = "UPDATE nom_filaestruc
                            SET  dominiofila = crear_dominiofila($idDominio, dominiofila)
                            WHERE ( $sqlWHERE  $sqlWHEREPadres)";
            $conn->execute($query);
        }
        $this->comprobarEliminar($conn, $idDominio, $arrayEliminar, $idEstructurasEliminar);
        $conn->commit();
        $conn->beginTransaction();
    }

    /**
     * Lista las estructuras del dominio en las que un usuario determinado tenga acceso.
     *
     * @author Seguridad.
     *
     * @param integer $idestructura - Identificador de la estructura desplegada | 0.
     * @param array $arrayAccess - Arreglo de accesos.
     *
     * @return array Retorna un listado con de estructuras.
     */
    public function loadAccessDomain($idestructura, $arrayAccess)
    {

        $sqlAccess = $sqlAccess2 = "";
        $iddominio = $this->global->Perfil->iddominio;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metadatos');
        $icon = "icono.icono AS icon";
        $iddominio = $iddominio ? $iddominio : 1;
        $sentencia = "fila.idpadre='$idestructura' AND fila.idfila<>fila.idpadre ";
        $sqlWhere
            = ($idestructura) ? $sentencia : "fila.idfila=fila.idpadre";
        if (count($arrayAccess) > 0) {
            $sqlAccess = self::getSqlAccess($arrayAccess);
            $sqlAccess2 = self::getSqlAccess($arrayAccess, 'f.');
        }
        $fontColor = "'<font style=\"color:green; font-weight:bold;\">'||";
        $fontEnd = "||'</font>'";
        $filaReplace = str_replace('fila.', 'f.', $sqlAccess);
        $filaReplaceLeaf = str_replace('fila.', 'filaLeaf.', $sqlAccess);
        $sqlLeafAccess = "
        SELECT COUNT(idfila)
        FROM nom_filaestruc filaLeaf
        WHERE parent_path operator (public.<@) fila.parent_path  AND dominiofila[$iddominio] = 1 :: bit AND $filaReplaceLeaf
      ";
        $query = "
      SELECT idfila as id, fila.dominiofila[$iddominio] = 0 :: bit as unchecked,
             fila.idpadre as _parent, $icon, (($sqlLeafAccess)=0) as leaf,
             CASE
                WHEN $sqlAccess THEN
                  (CASE
                      WHEN estructura.denominacion <> '' THEN $fontColor estructura.denominacion $fontEnd
			            END)
                ELSE
                  (CASE
                      WHEN estructura.denominacion <> ''  THEN estructura.denominacion
			            END)
             END AS text,
             CASE
                WHEN $sqlAccess THEN TRUE ELSE FALSE
             END AS access
      FROM mod_estructuracomp.nom_filaestruc fila
      INNER JOIN nom_concepto nomeav
          ON fila.idconcepto = nomeav.idconcepto
      INNER JOIN nom_icono icono
          ON icono.idicono = nomeav.idicono
      INNER JOIN dat_estructura estructura
          ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0)
      INNER JOIN  nom_organo orgest
          ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto)
      

      WHERE $sqlWhere
        AND fila.fechafin is null
        AND (fila.dominiofila[$iddominio] = 1 :: bit AND (estructura.idestructura IS NOT NULL)
            OR (SELECT count(distinct f.idfila) FROM mod_estructuracomp.nom_filaestruc f WHERE f.parent_path operator (public.<@) fila.parent_path  AND f.dominiofila[$iddominio] = 1 :: bit AND $sqlAccess2) > 0)
        
      --ORDER BY fila.idconcepto ASC
      UNION
      SELECT idfila as id, fila.dominiofila[$iddominio] = 0 :: bit as unchecked,
             fila.idpadre as _parent, $icon, (($sqlLeafAccess)=0) as leaf,
             CASE
                WHEN $sqlAccess THEN
                  (CASE
                      WHEN estructuraop.denominacion <> '' THEN $fontColor estructuraop.denominacion $fontEnd
			            END)
                ELSE
                  (CASE
                      WHEN estructuraop.denominacion <> ''  THEN estructuraop.denominacion
			            END)
             END AS text,
             CASE
                WHEN $sqlAccess THEN TRUE ELSE FALSE
             END AS access
      FROM mod_estructuracomp.nom_filaestruc fila
      INNER JOIN nom_concepto nomeav
          ON fila.idconcepto = nomeav.idconcepto
      INNER JOIN nom_icono icono
          ON icono.idicono = nomeav.idicono
      INNER JOIN dat_estructuraop estructuraop
          ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0 AND ((estructuraop.idconcepto = 5) OR estructuraop.idconcepto = 6))
      INNER JOIN  nom_organo orgest
          ON ( orgest.idorgano = estructuraop.idorgano AND orgest.idconcepto = fila.idconcepto)
      WHERE $sqlWhere
        AND fila.fechafin is null
        AND (fila.dominiofila[$iddominio] = 1 :: bit AND (estructuraop.idestructuraop IS NOT NULL)
            OR (SELECT count(distinct f.idfila) FROM mod_estructuracomp.nom_filaestruc f WHERE f.parent_path operator (public.<@) fila.parent_path  AND f.dominiofila[$iddominio] = 1 :: bit AND $sqlAccess2) > 0)
        
      --ORDER BY fila.idconcepto ASC
      ";
        //print_r($query);die;
        return $conn->fetchAll($query);
    }

    /**
     * Retorna un sql con el acceso a la fila
     *
     * @autor Seguridad
     *
     * @param $arrayAccess
     *
     * @return string
     */
    private static function getSqlAccess($arrayAccess, $prefix = "fila.")
    {
        $cant = count($arrayAccess);
        $sql = "(";
        $iterator = 0;
        foreach ($arrayAccess as $value) {
            $iterator++;
            if ($iterator != $cant) {
                $sql .= "$prefix" . "accesofila[$value] = 1 :: bit OR ";
            } else {
                $sql .= "$prefix" . "accesofila[$value] = 1 :: bit";
            }
        }

        return $sql .= ")";
    }

    /**
     * Obtener Acceso a la estructura
     *
     * @author    : Seguridad
     *
     * @param $idestructura
     * @param $iddominio
     * @param $idacceso
     *
     * @return array
     */
    public function getAccess($idestructura, $iddominio, $idacceso)
    {
        if(is_array($idestructura)){
            $idest = $idestructura['idestructura'];
            $sql = "
      SELECT idfila
      FROM mod_estructuracomp.nom_filaestruc
      WHERE (dominiofila[$iddominio] = 1 :: bit
            AND accesofila[$idacceso] = 1 :: bit AND fechafin is null AND idfila = $idest)";

            return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        }else{
            $sql = "
      SELECT idfila
      FROM mod_estructuracomp.nom_filaestruc
      WHERE (dominiofila[$iddominio] = 1 :: bit
            AND accesofila[$idacceso] = 1 :: bit AND fechafin is null AND idfila = $idestructura)";

            return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
        }
    }

    /**
     * Buscar las estructuras en las que se le asigno un rol a un usuario.
     *
     * @author    : Seguridad
     *
     * @param int $iddominio Identificador de dominio.
     * @param int $idacceso Numero consecutivo que representa un rol asignado a un usuario en una estructura.
     * @param     $arrayEstructurasIns Arreglo de identificadores de estructuras.
     *
     * @return array Arreglo bidimensional de identificadores estructuras.
     */
    function verificarAccesoEstrucExternas($iddominio, $idacceso, $arrayEstructurasIns)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if ($idacceso) {
            $sqlWhere = "AND fila.accesofila[$idacceso] = 1 :: bit";
        }
        if (count($arrayEstructurasIns)) {
            $sqlWhere = "AND fila.idfila in (" . implode(',', $arrayEstructurasIns) . ")";
        }
        $sql = "SELECT fila.idfila
                    FROM  mod_estructuracomp.nom_filaestruc fila
                WHERE (dominiofila[$iddominio] = 1 :: bit $sqlWhere)";
        $datos = $conn->fetchAll($sql);
        $mg->closeConnection($conn);

        return $datos;
    }

    /**
     * valida que exista al menos una entidad en el dominio.
     * @method existeEstructura
     *
     * @param integer $iddominio - Identificador del dominio.
     *
     * @return integer - Retorna la cantidad de entidades que pertenecen al diminio.
     */
    public function existeEstructura($iddominio)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $query = "SELECT COUNT(f.idfila) as cantidad FROM mod_estructuracomp.nom_filaestruc f
                INNER JOIN mod_estructuracomp.dat_estructura e ON (f.idfila = e.idestructura AND e.idproyecto = 0)
                WHERE f.fechafin is null AND f.dominiofila[$iddominio] = 1 :: bit";
        $resultado = $conn->fetchAll($query);

        return $resultado[0]['cantidad'];
    }

    /**
     * Actualizar la asignacion de un rol a un usuario en una estructura.
     *
     * @author    : Seguridad
     *
     * @param int $idDominio Identificador del dominio.
     * @param int $idacceso Numero consecutivo que representa un rol asignado a un usuario en una estructura.
     * @param array $arrayEstructuras Arreglo multidimensional de estructuras
     *                                (dimensiones: padres, estructuras, arrayEntidadesEliminar, arrayPadresEliminar).
     *
     * @return bool Verdadero si todo se realizo correctamente.
     */
    public function asignarAccesoRoles($idDominio, $idacceso, $arrayEstructuras)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        //Uniendo los arreglos de elementos a insertar y convirtiendolos para los where
        $arrayInsertar = array_merge($arrayEstructuras['estructuras'], $arrayEstructuras['padres']);
        $idEstructurasInsertar = implode(',', $arrayInsertar);
        //Uniendo los arreglos de elementos a eliminar y convirtiendolos para los where
        $arrayEliminar = array_merge(
            $arrayEstructuras['arrayPadresEliminar'], $arrayEstructuras['arrayEntidadesEliminar']
        );
        $idEstructurasEliminar = implode(',', $arrayEliminar);
        //Comprobando que existen elementos a insertar
        if (count($arrayInsertar) > 0) {
            //Eliminando de la busqueda de estructuras las especificadas a eliminar sus dominios
            $notIn = (count($arrayEliminar) > 0) ? " AND idfila NOT IN ($idEstructurasEliminar)" : '';
            //Se actualiza el vector de acceso de las estructuras.
            $conn->execute(
                "UPDATE nom_filaestruc
                            SET  accesofila = crear_dominiofila($idacceso, accesofila)
                            WHERE idfila IN ($idEstructurasInsertar) $notIn"
            );
        }
        //Comprobando que existen elementos a eliminar
        if (count($arrayEliminar) > 0) {
            //Se actualiza el vector de acceso de las estructuras.
            $conn->execute(
                "UPDATE nom_filaestruc
                            SET  accesofila[$idacceso] = 0::bit
                            WHERE accesofila[$idacceso] = 1::bit AND dominiofila[$idDominio] = 1::bit AND
                                  idfila IN ($idEstructurasEliminar)"
            );
        }
        $conn->commit();
        $conn->beginTransaction();

        return true;
    }

    /**
     * Buscar las estructuras en las que se le asigno un rol a un usuario.
     *
     * @author    : Seguridad
     *
     * @param int $idacceso Numero consecutivo que representa a un rol asignado a un usuario en una estructura.
     * @param int $iddominio Identificador de dominio.
     * @param array $arrayEst Arreglo de estructuras.
     *
     * @return array Arreglo de identificadores de estructuras.
     */
    public function accesoDadoArrayNoRol($iddominio, $idacceso, $arrayEst)
    {
        if (count($arrayEst) > 0)
            return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll(
                "
                SELECT fila.idfila as id
                FROM nom_filaestruc fila
                WHERE (fila.dominiofila [$iddominio] = 1 :: bit
                        AND accesofila [$idacceso] = 1 :: bit
                        AND fila.idfila IN (" . implode(',', $arrayEst) . ") )"
            );
        else{
            return array();
        }
    }

    /**
     * Buscar la cantidad de estructuras en las que se le asigno un rol a un usuario.
     *
     * @author    : Seguridad
     *
     * @param int $idacceso Numero consecutivo que representa a un rol asignado a un usuario en una estructura.
     * @param int $iddominio Identificador de dominio.
     *
     * @return int Cantidad de estructuras.
     */
    function cantAccesoFilas($idacceso, $iddominio)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "
      SELECT count(idfila) as cant
      FROM mod_estructuracomp.nom_filaestruc
      WHERE accesofila[$idacceso] = 1:: bit AND dominiofila[$iddominio] = 1 :: bit;";
        $cant = $conn->fetchAll($sql);
        $mg->closeConnection($conn);

        return $cant[0]['cant'];
    }

    /**
     * @param $conn
     * @param $idDominio
     * @param $arrayEliminar
     * @param $idEstructurasEliminar
     */
    private function comprobarEliminar($conn, $idDominio, $arrayEliminar, $idEstructurasEliminar)
    {

        //Comprobando que existen elementos a eliminar
        $arrayEliminar =array_unique($arrayEliminar);
        if (count($arrayEliminar) > 0) {
            //Consulta para la obtencion de los rangos de izq y derecho
            $filas = $conn->fetchAll(
              "
                    SELECT parent_path
                    FROM nom_filaestruc f
                    WHERE f.idfila IN ($idEstructurasEliminar) order by f.parent_path DESC"
            );

            foreach ($arrayEliminar as $value =>$key) {
                $parent_path = $filas[$value]['parent_path'];

                $sqlWHERE = "(parent_path operator (public.<@) '$parent_path')";

                //Se actualiza el vector de dominio de las estructuras.
                $conn->execute(
                  "UPDATE nom_filaestruc
                            SET  dominiofila[$idDominio] = 0::bit
                            WHERE dominiofila[$idDominio] = 1::bit AND ( $sqlWHERE )"
                );

            }

            //Condiciones para la captura de los hijos y los padres de las estructuras especificadas a insertar.

        }
    }

    /**
     * @param $arrayEstructuras
     *
     * @return bool
     */
    private function validaTamaño($arrayEstructuras)
    {
        return count($arrayEstructuras['padres']) > 0 && count($arrayEstructuras['estructuras']) > 0;
    }
}
