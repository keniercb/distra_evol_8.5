<?php

class DatIncidencia extends BaseDatIncidencia
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'DatElementos',
            array('local' => 'idincidencia', 'foreign' => 'idelemento')
        );
    }

    public function getByid($impacto)
    {
        return Doctrine::getTable('DatIncidencia')->find($impacto)->toArray();
    }

    public function getByidincidencia($idincidencia, $filtroelemento)
    {
        $cadena = "";
        if (count($filtroelemento) != 0) {
            foreach ($filtroelemento as $filtro) {
                if ($filtro['field'] == 'impacto') {
                    if ($filtro['data']['value'] == 'Bajo') {
                        $valor = '1';
                    } else {
                        if ($filtro['data']['value'] == 'Medio') {
                            $valor = '2';
                        } else {
                            $valor = '3';
                        }
                    }
                    $cadena .= " AND dat_incidencia.impacto = '$valor' ";
                }
            }
        }
        $consulta
            = "SELECT dat_incidencia.impacto
        FROM mod_objetivos.dat_incidencia
        WHERE dat_incidencia.idincidencia = '$idincidencia'" . $cadena;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getIncidencias($parametros)
    {
        $consulta
            = "SELECT *
                FROM mod_objetivos.dat_elementos e
                WHERE e.idtipoelemento = {$parametros->tipo}
                AND e.idusuariocrea = {$parametros->idusuario}
                OFFSET {$parametros->start} LIMIT {$parametros->limit}";
        $connA = Doctrine_Manager:: connection();
        //print_r($consulta);die;
        $res = $connA->execute($consulta);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function obtenerIncidencias($parametros)
    {
        $cadena
            = " SELECT e.denelemento, e.descelemento,i.idincidencia, i.impacto, e.activo,
                n.dennomenclador, n.idnomenclador, e.idusuariocrea,
                CASE WHEN (ui.idincidencia IS NOT NULL
                OR gi.idincidencia IS NOT NULL
                OR ei.idincidencia IS NOT NULL) THEN 1 ELSE 0 END AS publico,
                /*Para que cuando el usuario no tenga persona muestre usuario*/
                CASE WHEN p.idpersona is NULL THEN u.nombreusuario
                ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreusuario,

                COUNT(ee.*) AS cantidaddesviaciones

                FROM mod_objetivos.dat_elementos e

                INNER JOIN mod_objetivos.dat_incidencia i
                ON(i.idincidencia = e.idelemento)

                LEFT JOIN mod_objetivos.dat_usuario_incidencia ui
                ON(i.idincidencia = ui.idincidencia)

                LEFT JOIN mod_objetivos.dat_grupo_incidencia gi
                ON(i.idincidencia = gi.idincidencia)

                LEFT JOIN mod_objetivos.dat_estructura_incidencia ei
                ON(i.idincidencia = ei.idincidencia)

                LEFT JOIN mod_objetivos.dat_elementos_nom_nomenclador en
                ON(i.idincidencia = en.idelemento AND en.tiponomenclador = 6)

                LEFT JOIN mod_objetivos.nom_nomenclador n
                ON(n.idnomenclador = en.idnomenclador)

                INNER JOIN mod_seguridad.seg_usuario u
                ON (u.idusuario = e.idusuariocrea)

                LEFT JOIN mod_persona.dat_persona p
                ON (u.idpersona = p.idpersona)

                LEFT JOIN mod_objetivos.dat_elementos_dat_elementos ee
                ON (i.idincidencia =  ee.idelementopadre
                OR i.idincidencia = ee.idelementohijo )";
        //print_r($parametros);die;
        if ($parametros->iddesviacion && $parametros->accion == 'asociadas') {
            $cadena
                .= " INNER JOIN mod_objetivos.dat_elementos_dat_elementos eec
                        ON (i.idincidencia = eec.idelementohijo) ";
        }
        $cadena .= " WHERE e.idusuariocrea = {$parametros->idusuario} ";
        if ($parametros->iddesviacion && $parametros->accion == 'asociadas') {
            $cadena .= " AND eec.idelementopadre = {$parametros->iddesviacion} ";
        }
        if ($parametros->iddesviacion && $parametros->accion == 'noasociadas') {
            $cadena .= " AND i.idincidencia NOT IN (SELECT inc.idincidencia
                FROM mod_objetivos.dat_incidencia inc
                INNER JOIN mod_objetivos.dat_elementos_dat_elementos een
                ON (inc.idincidencia = een.idelementohijo
                AND een.idelementopadre = {$parametros->iddesviacion})) ";
        }
        if ($parametros->idelemento) {
            $cadena .= " AND i.idincidencia = {$parametros->idelemento} ";
        }
        //***---Filtros---***//
        if ($parametros->filtros) {
            foreach ($parametros->filtros as $datos) {
                if ($datos ['field'] == 'idelemento') {
                    $cadena .= " AND e.uriidelemento LIKE '%"
                        . $datos ['data'] ['value'] . "%'";
                }
                if ($datos ['field'] == 'denelemento') {
                    $cadena .= " AND upper(e.denelemento) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
                if ($datos['field'] == 'publico') {
                    if ($datos['data']['value'] == "Si") {
                        $cadena
                            .= " AND (ui.idincidencia IS NOT NULL
                        OR gi.idincidencia IS NOT NULL
                        OR ei.idincidencia IS NOT NULL)";
                    } else {
                        $cadena
                            .= " AND (ui.idincidencia IS NULL
                        AND gi.idincidencia IS NULL
                        AND ei.idincidencia IS NULL)";
                    }
                }
                if ($datos['field'] == 'dennomenclador') {
                    $cadena .= " AND upper(n.dennomenclador) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                }
            }
        }
        $cadena
            .= " GROUP BY e.denelemento,e.descelemento, i.idincidencia,
               i.impacto,  e.activo, n.dennomenclador, n.idnomenclador,
               e.idusuariocrea, ui.idincidencia,gi.idincidencia,
               ei.idincidencia,p.idpersona,u.nombreusuario";
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
            $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC)
        );
        $cadena .= " LIMIT(" . $parametros->limit . ") OFFSET("
            . $parametros->start . ") ";

        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['resultado'] = $result;
        return $resultado;
    }
}

