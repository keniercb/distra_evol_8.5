<?php

/**
 * @author    Liermes Ferriol Mena
 * @author    Jany Coto García
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomNomenclador extends BaseNomNomenclador
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomCategactividad',
            array('local' => 'idnomenclador', 'foreign' => 'idnomenclador')
        );
        $this->hasOne(
            'NomTipohoja',
            array('local' => 'idnomenclador', 'foreign' => 'idtipohoja')
        );
        $this->hasMany(
            'DatUsuarioNomNomenclador',
            array('local' => 'idnomenclador', 'foreign' => 'idnomenclador')
        );
        $this->hasMany(
            'DatGrupo',
            array('local'    => 'idnomenclador', 'foreign' => 'idgrupo',
                  'refClass' => 'DatGrupoNomNomenclador')
        );
    }

    public function Buscar($idnomenclador)
    {
        $temp = $this->conn->getTable('NomNomenclador')->find($idnomenclador);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador')->execute();
        return $result->toArray();
    }

    /*
     * Para usar en los demás componentes que lo necesiten (servicio)
     * Consulta que devuleve los nomencladores creados por mí como usuario
     */

    public function GetTodosNomencladoresPorTipo($tipoNom, $idUsuarioCrea)
    {
        $query = new Doctrine_Query();
        $activo = 1;
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                nom.publico as pub, nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )->from('NomNomenclador nom')->innerJoin(
                'nom.NomCategactividad cat'
            )->where(
                "nom.tiponomenclador = $tipoNom 
                    AND nom.idusuariocrea = $idUsuarioCrea 
                        AND nom.activo = $activo"
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto,nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idusuariocrea = $idUsuarioCrea 
                                AND nom.activo = $activo"
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo,
                    nom.caduca, nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->where(
                    "nom.tiponomenclador = $tipoNom 
                        AND nom.idusuariocrea = $idUsuarioCrea 
                            AND nom.activo = $activo"
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            }
        }
        return $result;
    }

    public function ObtenerArrayIdNomencladoresPorTipoPorAutor(
        $tipoNom, $idUsuarioLog
    ) {
        $query = new Doctrine_Query();
        $activo = 1;
        if ($tipoNom == 2) {
            $result = $query->select('nom.idnomenclador ')
                ->from('NomNomenclador nom')
                ->where(
                    "nom.tiponomenclador = $tipoNom 
                        AND nom.idusuariocrea = $idUsuarioLog "
                )
                ->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select('nom.idnomenclador ')
                    ->from('NomNomenclador nom')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idusuariocrea = $idUsuarioLog "
                    )
                    ->execute();
            } else {
                $result = $query->select('nom.idnomenclador')
                    ->from('NomNomenclador nom')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idusuariocrea = $idUsuarioLog"
                    )
                    ->execute();
            }
        }
        return $result->toArray();
    }

    public function getNomsActividad($tipo, $idusuario)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador')->where(
            'tiponomenclador = ? AND idusuariocrea = ?',
            array('1' => $tipo, '2' => $idusuario)
        )->execute();
        return $result->toArray();
    }

    public function eliminar($idnom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador n')
            ->where('n.idnomenclador = ? ', $idnom)
            ->execute();
    }

    /*
     * Consulta que devuelve los nomencladores de nivel superior
     */

    public function GetTodosNomencladoresPorTipoNivelSuperior(
        $tipoNom, $idNomenclador
    ) {
        $query = new Doctrine_Query();
        $activo = 1;
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                nom.publico as pub, nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )
                ->from('NomNomenclador nom')
                ->innerJoin('nom.NomCategactividad cat')
                ->where(
                    "nom.tiponomenclador = $tipoNom 
                        AND nom.idnomenclador = $idNomenclador 
                            AND nom.activo = $activo"
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idusuariocrea = $idUsuarioCrea 
                                AND nom.activo = $activo"
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo, 
                    nom.caduca, nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )
                    ->from('NomNomenclador nom')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idnomenclador = $idNomenclador 
                                AND nom.activo = $activo"
                    )
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            }
        }
        return $result;
    }

    public function getDenomNomenclador($idnomenclador, $idusuariocrea, $tipo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('dennomenclador as denom')->from(
            'NomNomenclador'
        )->where(
            "idnomenclador = $idnomenclador AND idusuariocrea = $idusuariocrea 
                AND tiponomenclador = $tipo"
        )->execute()->toArray();
        return $result [0] ['denom'];
    }

    /*
     * Consulta que devuleve los nomencladores publicados para todos los grupos y usuarios
     */

    public function GetNomenPublicoParaTodos($tipoNom, $publico)
    {
        $query = new Doctrine_Query();
        $activo = 1;
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.descnomenclador as descrip, nom.publico as pub,
                nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )
                ->from('NomNomenclador nom')
                ->innerJoin('nom.NomCategactividad cat')
                ->where(
                    "nom.tiponomenclador = $tipoNom 
                    AND nom.publicoxtodos = $publico AND nom.activo = $activo"
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                        AND nom.idusuariocrea = $idUsuarioCrea 
                            AND nom.activo = $activo"
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo,
                    nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )
                    ->from('NomNomenclador nom')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.publicoxtodos = $publico 
                                AND nom.activo = $activo"
                    )
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            }
        }
        return $result;
    }

    public function dameIdNomPorUsuario($idUsuario)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'DISTINCT (unom.idnomenclador) as idnomenclador'
        )
            ->from('DatUsuarioNomNomenclador unom')
            ->where('unom.idusuario = ?', $idUsuario)
            ->execute();
        return $result->toArray();
    }

    public function dameIdNomPorUsuarioyTipo($tipoNom, $idUsuario)
    {
        /* $query = new Doctrine_Query();
          $result = $query->select('DISTINCT (unom.idnomenclador) as idnomenclador')
          ->from('DatUsuarioNomNomenclador unom')
          ->innerjoin('unom.Nom')
          ->where('unom.idusuario = ? AND ', array($idUsuario,$tipoNom))
          ->execute();
          return $result->toArray(); */
    }

    public function dameIdGrupoPorUsuario($idUsuario)
    {
        $query = new Doctrine_Query();
        $result = $query->select('gu.idgrupo')->from('DatGrupoDatUsuario gu')
            ->where('gu.idusuario = ?', $idUsuario)->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
            )->execute();
        return $result;
    }

    public function dameIdNomPorGrupo($idGrupo)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'DISTINCT (gnom.idnomenclador) as idnomenclador'
        )
            ->from('DatGrupoNomNomenclador gnom')
            ->where('gnom.idgrupo = ?', $idGrupo)
            ->execute();
        return $result->toArray();
    }

    public function existeGrupoNom($idGrupo, $idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatGrupoNomNomenclador gnom')->where(
            "gnom.idgrupo = $idGrupo AND gnom.idnomenclador = $idNom"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function existeUsuarioNom($idUsuario, $idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatUsuarioNomNomenclador unom')->where(
            "unom.idusuario = $idUsuario AND unom.idnomenclador = $idNom"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function editarCampoPublicoNom($idNom, $publico)
    {
        $query = new Doctrine_Query();
        $query->update('NomNomenclador nom')->set(
            'nom.publico', '?', "$publico"
        )->where("nom.idnomenclador = $idNom")->execute();
    }

    public function editarCampoPublicoxTodosNom($idNom, $publicoXTodos)
    {
        $query = new Doctrine_Query();
        $query->update('NomNomenclador nom')->set(
            'nom.publicoxtodos', '?', "$publicoXTodos"
        )->where("nom.idnomenclador = $idNom")->execute();
    }

    /*
     * Para usar en el comonente nomencladores
     * Consulta que devuleve los nomencladores creados por mí como usuario
     */

    public function GetTodosNomencladoresPorTipoNom(
        $tipoNom, $idUsuarioCrea, $filters
    ) {
        $query = new Doctrine_Query();
        $consulta = "";
        if ($filters != null) {
            for ($index = 0; $index < count($filters); $index++) {
                $valor = $filters[$index]['data']['value'];
                $campo = $filters[$index]['field'];
                if ($valor == 'Si') {
                    $valor = 1;
                } elseif ($valor == 'No') {
                    $valor = 0;
                }
                if ($valor != 'car') {
                    if ($campo == 'denom') {
                        $consulta = $consulta
                            . " AND nom.dennomenclador ILIKE '%$valor%' ";
                    } elseif ($campo == 'pub') {
                        $consulta = $consulta . " AND nom.publico = $valor";
                    } elseif ($campo == 'activo') {
                        $consulta = $consulta . " AND nom.activo = $valor";
                    } elseif ($campo == 'fdesde') {
                        $comparacion = $filters[$index]['data']['comparison'];
                        $arrayfechainicio = explode(' ', $valor);
                        if ($comparacion == 'lt') {
                            $consulta = $consulta . " AND nom.fechainicio < '"
                                . $arrayfechainicio[0] . "'";
                        } elseif ($comparacion == 'gt') {
                            $consulta = $consulta . " AND nom.fechainicio > '"
                                . $arrayfechainicio[0] . "'";
                        } elseif ($comparacion == 'eq') {
                            $consulta = $consulta . " AND nom.fechainicio = '"
                                . $arrayfechainicio[0] . "'";
                        }
                    } elseif ($campo == 'fhasta') {
                        $comparacionA = $filters[$index]['data']['comparison'];
                        $arrayfechafin = explode(' ', $valor);
                        if ($comparacionA == 'lt') {
                            $consulta = $consulta . " AND nom.fechafin < '"
                                . $arrayfechafin[0] . "'";
                        } elseif ($comparacionA == 'gt') {
                            $consulta = $consulta . " AND nom.fechafin > '"
                                . $arrayfechafin[0] . "'";
                        } elseif ($comparacionA == 'eq') {
                            $consulta = $consulta . " AND nom.fechafin = '"
                                . $arrayfechafin[0] . "'";
                        }
                    } elseif ($campo == 'ancho') {
                        $comparacionB = $filters[$index]['data']['comparison'];
                        if ($comparacionB == 'lt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho < '"
                                . $valor . "'";
                        } elseif ($comparacionB == 'gt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho > '"
                                . $valor . "'";
                        } elseif ($comparacionB == 'eq') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho = '"
                                . $valor . "'";
                        }
                    } elseif ($campo == 'alto') {
                        $comparacionC = $filters[$index]['data']['comparison'];
                        if ($comparacionC == 'lt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho < '"
                                . $valor . "'";
                        } elseif ($comparacionC == 'gt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho > '"
                                . $valor . "'";
                        } elseif ($comparacionC == 'eq') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho = '"
                                . $valor . "'";
                        }
                    }
                }
            }
        }
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                nom.publico as pub,
                nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )->from('NomNomenclador nom')->innerJoin(
                'nom.NomCategactividad cat'
            )->where(
                "nom.tiponomenclador = $tipoNom AND nom.idusuariocrea = $idUsuarioCrea"
                . $consulta
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idusuariocrea = $idUsuarioCrea"
                        . $consulta
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo, 
                    nom.caduca, nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->where(
                    "nom.tiponomenclador = $tipoNom 
                        AND nom.idusuariocrea = $idUsuarioCrea"
                    . $consulta
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            }
        }
        return $result;
    }

    /*
     * Consulta que devuelve los nomencladores de nivel superior
     */

    public function GetTodosNomencladoresPorTipoNivelSuperiorNom(
        $tipoNom, $idNomenclador
    ) {
        $query = new Doctrine_Query();
        $activo = 1;
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                nom.publico as pub, nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )->from('NomNomenclador nom')->innerJoin(
                'nom.NomCategactividad cat'
            )->where(
                "nom.idnomenclador = $idNomenclador AND nom.activo = $activo"
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            if ($tipoNom == 8) {
                /* $cadena = "SELECT nom.idnomenclador as idnom, nom.dennomenclador as denom,
                  nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,th.alto,
                  nom.activo, nom.caduca, nom.descnomenclador as descrip, nom.publico as pub,
                  nom.publicoxtodos as pubtodos, (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                  nom.idpadre as _parent, nom.idusuariocrea as idautor
                  FROM mod_objetivos.nom_nomenclador nom
                  INNER JOIN mod_objetivos.nom_tipohoja th ON th.idtipohoja = nom.idnomenclador
                  WHERE nom.idnomenclador = $idNomenclador ";//die($cadena);
                  $conn2 = Doctrine_Manager :: connection();
                  $res = $conn2->execute($cadena);
                  $result = $res->fetchAll(); */
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        " nom.idnomenclador = $idNomenclador AND nom.activo = $activo"
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo, 
                    nom.caduca, nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->where(
                    "nom.tiponomenclador = $tipoNom 
                        AND nom.idnomenclador = $idNomenclador 
                            AND nom.activo = $activo"
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            }
        }
        return $result;
    }

    public function ObtenerDatosNomencladoresPorArrayId(
        $tipoNom, $arrayidnomencladores
    ) {
        $consulta = "";
        if ($filters != null) {
            for ($index = 0; $index < count($filters); $index++) {
                $valor = $filters[$index]['data']['value'];
                $campo = $filters[$index]['field'];
                if ($valor == 'Si') {
                    $valor = 1;
                } elseif ($valor == 'No') {
                    $valor = 0;
                }
                if ($valor != 'car') {
                    if ($campo == 'denom') {
                        $consulta = $consulta
                            . " AND nom.dennomenclador ILIKE '%$valor%' ";
                    } elseif ($campo == 'pub') {
                        $consulta = $consulta . " AND nom.publico = $valor";
                    } elseif ($campo == 'activo') {
                        $consulta = $consulta . " AND nom.activo = $valor";
                    } elseif ($campo == 'fdesde') {
                        $comparacion = $filters[$index]['data']['comparison'];
                        $arrayfechainicio = explode(' ', $valor);
                        if ($comparacion == 'lt') {
                            $consulta = $consulta . " AND nom.fechainicio < '"
                                . $arrayfechainicio[0] . "'";
                        } elseif ($comparacion == 'gt') {
                            $consulta = $consulta . " AND nom.fechainicio > '"
                                . $arrayfechainicio[0] . "'";
                        } elseif ($comparacion == 'eq') {
                            $consulta = $consulta . " AND nom.fechainicio = '"
                                . $arrayfechainicio[0] . "'";
                        }
                    } elseif ($campo == 'fhasta') {
                        $comparacionA = $filters[$index]['data']['comparison'];
                        $arrayfechafin = explode(' ', $valor);
                        if ($comparacionA == 'lt') {
                            $consulta = $consulta . " AND nom.fechafin < '"
                                . $arrayfechafin[0] . "'";
                        } elseif ($comparacionA == 'gt') {
                            $consulta = $consulta . " AND nom.fechafin > '"
                                . $arrayfechafin[0] . "'";
                        } elseif ($comparacionA == 'eq') {
                            $consulta = $consulta . " AND nom.fechafin = '"
                                . $arrayfechafin[0] . "'";
                        }
                    } elseif ($campo == 'ancho') {
                        $comparacionB = $filters[$index]['data']['comparison'];
                        if ($comparacionB == 'lt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho < '"
                                . $valor . "'";
                        } elseif ($comparacionB == 'gt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho > '"
                                . $valor . "'";
                        } elseif ($comparacionB == 'eq') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho = '"
                                . $valor . "'";
                        }
                    } elseif ($campo == 'alto') {
                        $comparacionC = $filters[$index]['data']['comparison'];
                        if ($comparacionC == 'lt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho < '"
                                . $valor . "'";
                        } elseif ($comparacionC == 'gt') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho > '"
                                . $valor . "'";
                        } elseif ($comparacionC == 'eq') {
                            $consulta
                                = $consulta . " AND nom.NomTipohoja.ancho = '"
                                . $valor . "'";
                        }
                    }
                }
            }
        }
        $query = new Doctrine_Query();
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                nom.publico as pub, nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )
                ->from('NomNomenclador nom')
                ->innerJoin('nom.NomCategactividad cat')
                ->where("nom.tiponomenclador = $tipoNom " . $consulta)
                ->whereIn("nom.idnomenclador", $arrayidnomencladores)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )
                    ->from('NomNomenclador nom')
                    ->innerJoin('nom.NomTipohoja th')
                    ->where("nom.tiponomenclador = $tipoNom " . $consulta)
                    //->whereIn("nom.idnomenclador",$arrayidnomencladores)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo,
                    nom.caduca, nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )
                    ->from('NomNomenclador nom')
                    ->where("nom.tiponomenclador = $tipoNom " . $consulta)
                    ->whereIn("nom.idnomenclador", $arrayidnomencladores)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
            }
        }
        return $result;
    }

    /*
     * Devuleve los nomencladores publicados para todos los grupos y usuarios
     */

    public function GetNomenPublicoParaTodosNom($tipoNom, $publico)
    {
        $query = new Doctrine_Query();
        $activo = 1;
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.descnomenclador as descrip, nom.publico as pub,
                nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )->from('NomNomenclador nom')->innerJoin(
                'nom.NomCategactividad cat'
            )->where(
                "nom.tiponomenclador = $tipoNom AND nom.publicoxtodos = $publico 
                    AND nom.activo = $activo"
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                        AND nom.publicoxtodos = $publico AND nom.activo = $activo"
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo,
                    nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->where(
                    "nom.tiponomenclador = $tipoNom 
                    AND nom.publicoxtodos = $publico AND nom.activo = $activo"
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            }
        }
        return $result;
    }

    public function existeNomenclador($tipoNom, $denom)
    {
        $query = new Doctrine_Query();
        $result = $query->select('nom.idnomenclador')->from(
            'NomNomenclador nom'
        )->where(
            "nom.tiponomenclador = $tipoNom AND nom.dennomenclador = '$denom'"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function existeNomencladorSegunId($idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador nom')->where(
            "nom.idnomenclador = $idNom"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function existeNomencladorSegunIdPadre($idNomPadre)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador nom')->where(
            "nom.idpadre = $idNomPadre"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function existeNomencladorSegunDenominacion($denominacion, $tipo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador')->where(
            "tiponomenclador = $tipo AND dennomenclador = '$denominacion'"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result->toArray();
    }

    public function ObtenerNomencladorPorNombreTipoAuotr(
        $denominacion, $tipo, $idautor
    ) {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador')->where(
            "tiponomenclador = $tipo AND idusuariocrea = $idautor 
                AND dennomenclador = '$denominacion'"
        )->execute();
        return $result->toArray();
    }

    //------------------------------------------
    // SIN PROBAR -----------------------------------
    public function buscarHijosNomenclador($node)
    {
        $query = new Doctrine_Query();
        $sqlSoloRaices = !$node ? "nom.idpadre = nom.idnomenclador"
            : "nom.idpadre = '$node' AND nom.idpadre <> nom.idnomenclador";
        $result = $query->select(
            'nom.idnomenclador as idnom, nom.dennomenclador as denom,
            nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo,
            nom.descnomenclador as descrip, nom.publico as pub,
            nom.publicoxtodos as pubtodos, 
            (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
            nom.idpadre as _parent, nom.idusuariocrea as idautor'
        )->from('NomNomenclador nom')->where($sqlSoloRaices)->setHydrationMode(
            Doctrine::HYDRATE_ARRAY
        )->execute();
        return $result;
    }

    public function DameNomencladoresHijos($idpadre)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador nom')->where(
            "nom.idpadre = $idpadre"
        )->execute();
        return $result->toArray();
    }

    public function buscarFamilia($idNom)
    {
        $ordenes = NomNomenclador::buscarOrdenIzqDer($idNom);
        $ordend = $ordenes [0] ['ordenderecho'];
        $ordeni = $ordenes [0] ['ordenizquierdo'];
        $query = new Doctrine_Query();
        $result = $query->select('nom.idnomenclador')->from(
            'NomNomenclador nom'
        )->where("nom.ordender <='$ordend' AND nom.ordenizq >='$ordeni'")
            ->orderby('nom.ordenizq  DESC')->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
            )->execute();
        return $result;
    }

    public function buscarOrdenIzqDer($idNom)
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'nom.ordender as ordenderecho, nom.ordenizq as ordenizquierdo'
        )->from('NomNomenclador nom')->where('nom.idnomenclador = ?', $idNom)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function cambiarEstado($node, $estado)
    {
        $query = new Doctrine_Query();
        $query->update('NomNomenclador nom')->set('activo', '?', "$estado")
            ->where("nom.idnomenclador = $node")->execute();
    }

    public function cambiarFechaInicio($node, $fechaInicio)
    {
        $query = new Doctrine_Query();
        $query->update('NomNomenclador nom')->set(
            'fechainicio', '?', "$fechaInicio"
        )->where("nom.idnomenclador = $node")->execute();
    }

    public function cambiarCaduca($node)
    {
        $caduca = 0;
        $query = new Doctrine_Query();
        $query->update('NomNomenclador nom')->set('caduca', '?', $caduca)
            ->where("nom.idnomenclador = $node")->execute();
    }

    public function cambiarFechaFin($node, $fechaFin)
    {
        $query = new Doctrine_Query();
        $query->update('NomNomenclador nom')->set('fechafin', '?', "$fechaFin")
            ->where("nom.idnomenclador = $node")->execute();
    }

    // porbando para modificar
    public function buscarDatosNom($idNom, $tipoNom)
    {
        $query = new Doctrine_Query();
        if ($tipoNom == 2) {
            $result = $query->select(
                'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                nom.fechainicio as fdesde, nom.fechafin as fhasta, cat.color,
                nom.activo, nom.descnomenclador as descrip, nom.publico as pub,
                nom.publicoxtodos as pubtodos, 
                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                nom.idpadre as _parent, nom.idusuariocrea as idautor'
            )->from('NomNomenclador nom')->innerJoin(
                'nom.NomCategactividad cat'
            )->where(
                'nom.tiponomenclador = ? AND nom.idnomenclador = ?', $tipoNom,
                $idNom
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            if ($tipoNom == 8) {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, th.ancho,
                    th.alto, nom.activo, nom.caduca, nom.descnomenclador as descrip, 
                    nom.publico as pub, nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->innerJoin('nom.NomTipohoja th')
                    ->where(
                        "nom.tiponomenclador = $tipoNom 
                            AND nom.idusuariocrea = $idUsuarioCrea 
                                AND nom.activo = $activo"
                    )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            } else {
                $result = $query->select(
                    'nom.idnomenclador as idnom, nom.dennomenclador as denom,
                    nom.fechainicio as fdesde, nom.fechafin as fhasta, nom.activo,
                    nom.descnomenclador as descrip, nom.publico as pub,
                    nom.publicoxtodos as pubtodos, 
                    (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                    nom.idpadre as _parent, nom.idusuariocrea as idautor'
                )->from('NomNomenclador nom')->where(
                    'nom.tiponomenclador = ? AND nom.idnomenclador = ?',
                    $tipoNom, $idNom
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            }
        }
        return $result;
    }

    public function buscarDatosGrupoNom($idNom, $idGrupo)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatGrupoNomNomenclador gn')->where(
            "gn.idnomenclador = '$idNom' and gn.idgrupo = $idGrupo"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($result) > 0) {
            return true;
        }
        return false;
    }

    public function buscarDatosGrupoUsuarioNom($idNom, $idUsuario)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatUsuarioNomNomenclador gun')->where(
            "gun.idnomenclador = '$idNom' and gun.idusuario=$idUsuario"
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (count($result) > 0) {
            return true;
        }
        return false;
    }

    public function DameNomencladoresDadoIdUsuarioCreayTipo(
        $idusuario, $tiponomenclador
    ) {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador n')->where(
            "n.idusuariocrea = $idusuario AND n.tiponomenclador = $tiponomenclador"
        )->execute();
        return $result->toArray();
    }

    public function DameNomHijosDadoNomPadre($idnompadre)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNomenclador n')->where(
            "n.idpadre = $idnompadre "
        )->execute();
        return $result->toArray();
    }

    public function ObtenerNomencladoresCalendarioUsuario(
        $idusuariosession, $tiponomenclador, $fechainicio, $fechafin
    ) {
        $cadena
            = "(n.idusuariocrea = '$idusuariosession' 
                OR un.idusuario = '$idusuariosession')";
        $query = new Doctrine_Query();
        $result = $query->select("idnomenclador")->from("NomNomenclador n")
            ->leftJoin("n.DatUsuarioNomNomenclador un ")->where(
                "n.tiponomenclador = $tiponomenclador AND " . $cadena
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function ObtenerNomencladoresCalendarioGrupo(
        $idgrupo, $tiponomenclador, $fechainicio, $fechafin
    ) {
        $cadena = "(gn.idgrupo = '$idgrupo')";
        $query = new Doctrine_Query();
        $result = $query->select("idnomenclador")->from("NomNomenclador n")
            ->leftJoin("n.DatGrupoNomNomenclador gn ")->where(
                "n.tiponomenclador = $tiponomenclador AND " . $cadena
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function obtenerNomTipoActividad()
    {
        $query = new Doctrine_Query();
        $result = $query->select('n.denominacion')
            ->from('NomNomenclador n')
            ->innerJoin('n.NomCategactividad.cta')
            ->execute();
        return $result->toArray();
    }

    public function obtenerNomCatActividad()
    {
        $query = new Doctrine_Query();
        $result = $query->select('n.denominacion')
            ->from('NomNomenclador n')
            ->innerJoin('n.NomCategactividad.cta')
            ->execute();
        return $result->toArray();
    }

    public function obtenerDenoNomCatActividad($id)
    {
        $query = new Doctrine_Query();
        $result = $query->select('n.dennomenclador')
            ->from('NomNomenclador n')
            ->where('n.idnomenclador = ?', $id)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function obtenerNomHijosDadoNomPadre($ordenizq, $ordender)
    {
        $query = new Doctrine_Query();
        $result = $query->select('nom.idnomenclador as idnom')
            ->from('NomNomenclador nom')
            ->where("nom.ordenizq > $ordenizq AND nom.ordender < $ordender")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

  public function listarNomencladoresALL($tipoNom)
  {
    $selectidnom = "nom.idnomenclador as idnom";
    $devolverPadre = "null as _parent";

    $cadenaWHERE
      = " WHERE nom.tiponomenclador={$tipoNom}  ";
    if ($tipoNom == 2) {
      $joinCatActividad
                      = " INNER JOIN mod_objetivos.nom_categactividad ca 
                    ON ca.idnomenclador=nom.idnomenclador ";
      $selectTipohoja = " ca.color, ";
    } else if ($tipoNom == 12) {
      $joinTipoDia
                      = " INNER JOIN mod_objetivos.nom_tipodia td
                    ON td.idtipodia=nom.idnomenclador ";
      $selectTipohoja = " td.color, 
            --td.incidencia,
            ";
    }
    else {
      if ($tipoNom == 8) {
        $joinTipohoja
                        = " INNER JOIN mod_objetivos.nom_tipohoja th 
                        ON th.idtipohoja = nom.idnomenclador ";
        $selectTipohoja = " th.alto, th.ancho,";
      } else {
        if ($tipoNom == 9) {
          $joinTipoInvolucrado
                                 = " INNER JOIN mod_objetivos.nom_tipoinvolucrado ti 
                            ON ti.idtipoinvolucrado = nom.idnomenclador ";
          $selectTipoinvolucrado = " ti.inicial, ti.incidencia,";
        }
      }
    }

    $cadenaWHERE .= " AND nom.activo = 1";


    $fechaactual = "'" . date('Y-m-d') . "'";
    $cadenaSELECT = " SELECT  CASE
                        WHEN nom.idnomenclador in (  Select idnomenclador
                        from mod_objetivos.dat_elementos_nom_nomenclador
                        INNER JOIN mod_objetivos.dat_actividades
                        ON(dat_actividades.idactividad = dat_elementos_nom_nomenclador.idelemento )
                        WHERE dat_elementos_nom_nomenclador.tiponomenclador = 5
                        AND dat_actividades.fechafin >= {$fechaactual})
                        THEN 1 else 0
                        end as enuso ,{$selectidnom}, nom.dennomenclador as denom,
                                nom.fechainicio as fdesde, 
                                nom.fechafin as fhasta, {$selectTipohoja}{$selectTipoinvolucrado}
                                nom.activo, nom.caduca, 
                                nom.descnomenclador as descrip, 
                                nom.publico as pub,
                                nom.idpadre,
                                nom.publicoxtodos as pubtodos, 
                                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                                {$devolverPadre}, nom.idusuariocrea as idautor ";
    $cadenaJOIN = " FROM mod_objetivos.nom_nomenclador nom
                      {$joinCatActividad}
                      {$joinTipoDia}
                      {$joinTipohoja} 
                      {$joinTipoInvolucrado}
                      LEFT JOIN mod_objetivos.dat_usuario_nom_nomenclador dunom 
                      ON (nom.idnomenclador = dunom.idnomenclador ) ";
    $cadenaQuery = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
    $sqlTotal = $cadenaQuery;
    $conn = Doctrine_Manager::connection();
    $result->data = $conn->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);
    $result->total = count($conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC));
    return $result;
  }

}
//fin clase 



