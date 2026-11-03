<?php

class DatSubsistemaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatSubsistema $datSubsistema)
    {
        $datSubsistema->save();
        return true;
    }

    public function Actualizar(DatSubsistema $datSubsistema)
    {
        $datSubsistema->save();
        return true;
    }

    public function Eliminar($datSubsistema)
    {
        if ($datSubsistema->delete()) {
            return true;
        }
    }

    public function CargarSubsistema($start = 0, $limit = 0)
    {
        return DatSubsistema::GetTodos($start, $limit);
    }

    public function CargarSubsistemaMod($start = 0, $limit = 0, $idtdoc = 0)
    {
        $todos = DatSubsistema::GetTodos($start, $limit);
        $submarcados = DatSubsistema::GetTodosMod($start, $limit, $idtdoc);
        $result['data'] = Array();
        foreach ($todos['data'] as $row) {
            $row['marcado'] = false;
            foreach ($submarcados as $rowsub) {
                if ($rowsub['idsubsistema'] == $row['idsubsistema']) {
                    $row['marcado'] = true;
                }
            }
            $result['data'][] = $row;
        }
        $result['cant'] = $todos['cant'];
        return $result;
    }
}

