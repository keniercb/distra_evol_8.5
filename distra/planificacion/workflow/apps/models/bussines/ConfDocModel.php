<?php

class ConfDocModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(ConfDoc $confDoc)
    {
        $confDoc->save();
        return true;
    }

    public function Actualizar(ConfDoc $confDoc)
    {
        $confDoc->save();
        return true;
    }

    public function Eliminar($confDoc)
    {
        if ($confDoc->delete()) {
            return true;
        }
    }

    public function CargarTipoDoc($idsub)
    {
        return ConfDoc::GetTodos($idsub);
    }

    public function CargarTipoDocConf($start, $limit)
    {
        $arraytipodoc = ConfDoc::GetPorLimite($start, $limit);
        if (isset($arraytipodoc['data'][0])) {
            foreach ($arraytipodoc['data'] as $key => $tipodoc) {
                $arraytipodoc['data'][$key]['denominacion']
                    = $tipodoc['denominacion'] . '*' . $tipodoc['idtipodoc'];
                $arraytipodoc['data'][$key]['nombretipodocumento']
                    = $tipodoc['denominacion'];
            }
        }
        return $arraytipodoc;
    }
}

