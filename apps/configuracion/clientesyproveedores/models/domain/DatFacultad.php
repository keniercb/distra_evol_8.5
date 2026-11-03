<?php

/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 17/03/2015
 * Time: 3:39
 */
class DatFacultad extends BaseDatFacultades
{

    public function setUp()
    {
        parent::setUp();
    }

    static function deleteFromArray($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatFacultades')
            ->whereIn('idfacultad', $array)
            ->execute();
    }

    static function obtenerFacultades($post)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $where = [];
            $checked = ' FALSE ';
            $facultades = '';
            $start = '';
            $limit = '';
            if ($post['idcontacto'] != '' && $post['idcontacto'] != null) {
//            $where[] = " c.denominacion ILIKE '%".$post['idcontacto']."%' ";
                $facultades
                    = " LEFT JOIN mod_crmclienteproveedor.dat_facultad f
            ON c.idtipofacultad=f.idtipofacultad AND f.idcontacto=" . $post['idcontacto'] . " ";
                $checked = ' COALESCE((CASE WHEN f.idfacultad NOTNULL THEN TRUE ELSE FALSE END),FALSE) ';
            }
            if ($post['denominacion'] != '' && $post['denominacion'] != null) {
                $where[] = " c.denominacion ILIKE '%" . $post['denominacion'] . "%' ";
            }
            if ($post['start']) {
                $start = " offset " . $post["start"];
            }
            if ($post['limit']) {
                $limit = " limit " . $post["limit"];
            }
            $where = count($where) > 0 ? " WHERE " . implode(' AND ', $where) : "";
            $resp = $conexionActual->fetchAll(
                "SELECT count(c.idtipofacultad) over() as total,c.* ,$checked as checkedd
                FROM mod_crmclienteproveedor.nom_tipofacultad c ".$facultades.$where.$start.$limit
            );
            $total = count($resp) ? $resp[0]['total'] : 0;
            return array('data' => $resp, 'total' => $total);
        } catch (Exception $e) {
            throw $e;
        }
    }
}