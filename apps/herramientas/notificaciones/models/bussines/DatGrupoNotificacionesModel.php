<?php

class DatGrupoNotificacionesModel extends DatDestinatarioModel
{
    public function DatGrupoNotificacionesModel()
    {
        parent:: DatDestinatarioModel();
        $this->type = 'Grupo';
    }

    public function insertar_datgruponotificaciones(
        DatGrupoNotificaciones $datGrupo
    )
    {
        //@TODO: redefinir el método existe para el grupo
        if (!$datGrupo->existe()) {
            $datGrupo->iddestinatario = parent:: insertardat_destinatario();
            $datGrupo->save();
        } else {
            throw new ZendExt_Exception('HERRNOT003');
        }
    }

    public function modificar_datgruponotificaciones(
        DatGrupoNotificaciones $datGrupo
    )
    {
        if (!$datGrupo->existe()) {
            $datGrupo->save();
        } else {
            throw new ZendExt_Exception('HERRNOT003');
        }
    }

    public function eliminarnom_datgruponotificaciones(DatGrupoNotificaciones $datGrupo)
    {
        $datGrupo->delete();
    }

    public function cargarGrupos($parent, $start = 0, $limit = 10)
    {
        $groups = DatGrupoNotificaciones:: cargarGrupos(
            $parent, $start, $limit
        );
        $idTipoDest = $this->getTypeId();
        for ($i = 0; $i < count($groups); $i++) {
            $groups[$i]['idtipodestinatario'] = $idTipoDest;
            $groups[$i]['grupos'] = $this->getGroupsOf(
                $groups[$i]['iddestinatario']
            );
        }

        return $groups;
    }

    public function getConcretDestinatarios(
        $iddest, $start = null, $limit = null, &$total = 0
    )
    {
        $dests = Doctrine:: getTable('DatGrupoNotificaciones')
            ->createQuery('g')
            ->where('g.iddestinatario = ?', $iddest);
        $dests = $dests->innerJoin('g.DatGrupoDestinatario');
        $total = $dests->execute()->toArray();
        $total = count($total[0]['DatGrupoDestinatario']);
        if ($start && $limit) {
            $dests = $dests->offset($start)->limit($limit);
        }
        $dests = $dests->execute()->toArray();
        $concretDestinatarios = array();
        if (count($dests) === 1) {
            foreach ($dests[0]['DatGrupoDestinatario'] as $destinatario) {
                $concretDestinatarioModel = $this->getConcretDestinatarioModel(
                    $destinatario['iddestinatario']
                );
                if ($this->type !== (string)$concretDestinatarioModel) {
                    $result = $concretDestinatarioModel->getConcretDestinatarios($destinatario['iddestinatario']);
                    $concretDestinatarios[(string)$concretDestinatarioModel][]
                        = $result[(string)$concretDestinatarioModel];
                } else {
                    $concretDestinatariosOfGroup = $concretDestinatarioModel->getConcretDestinatarios(
                        $destinatario['iddestinatario']
                    );
                    foreach (
                        $concretDestinatariosOfGroup as $typeOfDest =>
                        $concretIds
                    ) {
                        $concretDestinatarios[$typeOfDest][] = $concretIds[0];
                    }
                }
                //@TODO array_unique
            }
        }

        return $concretDestinatarios;
    }

    public function getFullName($iddest)
    {
        $grupoTable = new DatGrupoNotificaciones();
        $grupo = end($grupoTable->getByParam('iddestinatario', $iddest));

        return $grupo['nombre'];
    }

} 