<?php

class DatEstudiomatrizfmpeirModel extends ZendExt_Model
{

    public static function obtenerEstudioByProyecto($idproyecto)
    {
        return DatEstudiomatrizfmpeir::obtenerEstudioByProyecto($idproyecto);
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function obtenerIndicador($p)
    {
        $_integrator = ZendExt_IoC::getInstance();

        $select = "select i.idfuente, i.denominacion, i.descripcion, i.idindicadorfmpeir";
        $from = " from mod_planifintegracion.dat_indicadorfmpeir i ";
        $innerjoin = " inner join mod_planifintegracion.dat_elementofuerzamotriz e on (i.idindicadorfmpeir = e.idindicadorfmpeir)";
        $lesft = " left join mod_planifintegracion.nom_elementopeir el on (e.idelementopeir = el.idelementopeir)";
        $lesft .= " left join mod_planifintegracion.nom_fuerzamotriz f on (f.idfuerzamotriz = e.idfuerzamotriz)";
        $where = " where e.idelementopeir = {$p['idelementopeir']} and e.idfuerzamotriz = {$p['idfuerzamotriz']} ";
        if ($p['fuente'] != '')
            $where .= " and i.idfuente = {$p['fuente']} ";
        if ($p['denominacion'])
            $where .= " and lower(i.denominacion) like '%" . strtolower($p['denominacion']) . "%'  ";

        $orderBy = " ORDER BY i.idindicadorfmpeir desc; ";
        $sql = $select . $from . $innerjoin . $lesft . $where . $orderBy;

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $pos => $res) {
            $actor = $_integrator->actoresfuentes->getActor($res['idfuente']);
            $res['fuente'] = $actor['Estructura']['denominacion'];
            $result[$pos] = $res;
        }
        return array('success' => true, 'data' => $result, 'cantidad_filas' => count($result));
    }

    public function obtenerindicadordeintegracion($p)
    {
        $_integrator = ZendExt_IoC::getInstance();

        $select = "select ne.idindicador, ne.denominacion , ne.idelementopeir, ne.idfuente, ne.descripcion ";
        $from = " from mod_planifintegracion.nom_indicador ne ";
        $innerjoin = " Inner Join mod_planifintegracion.dat_estudiomatrizfmpeir m on (m.idestudiomatrizfmpeir = ne.idestudiomatrizfmpeir)";
        $where = " where m.idproyecto = {$p['idproyecto']} ";
        if ($p['fuente'] != '')
            $where .= " and ne.idfuente = {$p['fuente']} ";
        if ($p['denominacion'])
            $where .= " and lower(ne.denominacion) like '%" . strtolower($p['denominacion']) . "%'  ";

        $orderBy = " ORDER BY ne.denominacion asc; ";
        $sql = $select . $from . $innerjoin . $where . $orderBy;
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as $pos => $res) {
            $actor = $_integrator->actoresfuentes->getActor($res['idfuente']);
            $res['fuente'] = $actor['Estructura']['denominacion'];
            $result[$pos] = $res;
        }
        return array('success' => true, 'data' => $result, 'cantidad_filas' => count($result));
    }

    public function obtenerElementopeir()
    {
        try {
            $result = DatEstudiomatrizfmpeir::obtenerElementopeir();
            foreach ($result as $pos => $res) {
                $res['qtip'] = $res['denominacion'];
                $result[$pos] = $res;
                $result[$pos]['children'] = DatEstudiomatrizfmpeir::obtenerNodosHijos($res['idfuerzamotriz'], $pos);
            }
            return $result;
        } catch (Exception $exc) {
            return array('success' => false, 'msg' => $exc->getMessage());
        }
    }

    public function adicionarIndicador($p, $q)
    {
        try {
            $res = 4;
            //CASO ELIMINAR
            if (count($p['del']) > 0) {
                $eliminadas = $p['del'];
                foreach ($eliminadas as $value) {
                    $objVar = Doctrine::getTable('DatIndicadorfmpeir')->find($value['idindicadorfmpeir']);
                    $objVar->delete();
                    $res = 1;
                }
            }
            // CASO MODIFICAR
            if (count($p['mod']) > 0) {
                $modificadas = $p['mod'];
                foreach ($modificadas as $value) {
                    $indicador = Doctrine::getTable('DatIndicadorfmpeir')->find($value['idindicadorfmpeir']);
                    if ($value['idfuente'])
                        $indicador->idfuente = $value['idfuente'];
                    if ($value['denominacion'])
                        $indicador->denominacion = $value['denominacion'];
                    $indicador->descripcion = $value['descripcion'];
                    $indicador->save();

                    $fuerza = Doctrine::getTable('DatElementofuerzamotriz')->find($indicador->idindicadorfmpeir);
                    if (!$fuerza->idelementofuerzamotriz) {
                        $fuerza = new DatElementofuerzamotriz();
                        if ($q['idfuerzamotriz'])
                            $fuerza->idfuerzamotriz = $q['idfuerzamotriz'];
                        if ($q['elementopeir'])
                            $fuerza->idelementopeir = $q['elementopeir'];
                        if ($indicador->idindicadorfmpeir)
                            $fuerza->idindicadorfmpeir = $indicador->idindicadorfmpeir;
                        $fuerza->save();
                    }
                    $res = 2;
                }
            }
            // CASO ADICIONAR
            if (count($p['add']) > 0) {
                $adicionadas = $p['add'];
                foreach ($adicionadas as $value) {
                    $indicador = new DatIndicadorfmpeir();
                    if ($value['idfuente'])
                        $indicador->idfuente = $value['idfuente'];
                    if ($value['denominacion'])
                        $indicador->denominacion = $value['denominacion'];
                    $indicador->descripcion = $value['descripcion'];
                    $indicador->save();


                    $fuerza = Doctrine::getTable('DatElementofuerzamotriz')->find($indicador->idindicadorfmpeir);
                    if (!$fuerza->idelementofuerzamotriz) {
                        $fuerza = new DatElementofuerzamotriz();
                        if ($q['idfuerzamotriz'])
                            $fuerza->idfuerzamotriz = $q['idfuerzamotriz'];
                        if ($q['elementopeir'])
                            $fuerza->idelementopeir = $q['elementopeir'];
                        if ($indicador->idindicadorfmpeir)
                            $fuerza->idindicadorfmpeir = $indicador->idindicadorfmpeir;
                        $fuerza->save();
                    }
                    $res = 3;
                }
            }
            return array('success' => true, 'fmpeir' => $res);
        } catch (Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage());
        }
    }

    public function saveElemento($p)
    {
        try {
            $res = 4;
            //CASO ELIMINAR
            $eliminadas = $p['del'];
            foreach ($eliminadas as $value) {
                $query = new Doctrine_Query ();
                try {
                    $idelementopeir = $value['idelementopeir'];
                    $result = $query->delete()->from('NomElementopeir')->where("idelementopeir = '$idelementopeir'")->execute();
                    $res = 1;
                } catch (Exception $e) {
                    if ($e->GetCode() == 23503) {
                        Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
                        $sql = "update mod_planifintegracion.nom_elementopeir set fechafin = CURRENT_DATE where idelementopeir  = $idelementopeir";
                        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql);
                        return array('success' => false, 'mensaje' => 'Elemento que usted quiere eliminar está en uso');
                    }
                }
            }
            // CASO MODIFICAR
            $modificadas = $p['mod'];
            foreach ($modificadas as $value) {
                $indicador = Doctrine::getTable('NomElementopeir')->find($value['idelementopeir']);
                if ($value['denominacion'])
                    $indicador->denominacion = $value['denominacion'];
                $indicador->descripcionpresion = $value['descripcionpresion'];
                $indicador->descripcionestado = $value['descripcionestado'];
                $indicador->descripcionimpacto = $value['descripcionimpacto'];
                $indicador->descripcionrespuesta = $value['descripcionrespuesta'];
                if ($value['fechafin'])
                    $indicador->fechafin = $value['fechafin'];
                $indicador->save();
                $res = 2;
            }
            // CASO ADICIONAR
            $adicionadas = $p['add'];
            foreach ($adicionadas as $value) {
                $indicador = new NomElementopeir();
                if ($value['denominacion'])
                    $indicador->denominacion = $value['denominacion'];
                $indicador->descripcionpresion = $value['descripcionpresion'];
                $indicador->descripcionestado = $value['descripcionestado'];
                $indicador->descripcionimpacto = $value['descripcionimpacto'];
                $indicador->descripcionrespuesta = $value['descripcionrespuesta'];
                if ($value['fechafin'])
                    $indicador->fechafin = $value['fechafin'];
                $indicador->save();
                $res = 2;
            }
            return array('success' => true, 'fmpeir' => $res);
        } catch (Exception $e) {
            return array('success' => false, 'msg' => $e->getMessage());
        }
    }

}
