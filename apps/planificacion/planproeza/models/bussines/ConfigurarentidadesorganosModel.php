<?php

class ConfigurarentidadesorganosModel extends ZendExt_Model {

    public function listarRelacionEntidadOrgano($params) {
        $datEntidadOrg = new DatEntidadorganosatisface();
        $result = $datEntidadOrg->listarRelacionEntidadOrgano($params);
        if (isset($result['resultado'])) {
            if ($result['total'] > 0) {
                foreach ($result['resultado'] as $value => $key) {
                    if ($key['identidad']) {
                        try {
                            $entidad = $this->integrator->metadatos->DameEstructura($key['identidad']);
                            if (!empty($entidad[0])) {
                                $icon = 'img src="' . $entidad[0]->icon . '"';
                                $denomEntidad = $entidad[0]->denominacion;
                            } else {
                                $denomEntidad = '';
                            }
                        } catch (Exception $e) {
                            $denomEntidad = '';
                        }
                        $result['resultado'][$value]['denomentidad'] = $denomEntidad;
                    }
                    if ($key['idorganosatisface']) {
                        $idorganosatisface = $key['idorganosatisface'];
                        $datEntidadOrg = new DatEntidadorganosatisface();
                        $denomOrgano = $datEntidadOrg->denominacionOrganoSatisface($idorganosatisface);
                        if (!empty($denomOrgano[0])) {
                            $denomOrgano = $denomOrgano[0]['denomorgano'];
                        } else
                            $denomOrgano = '';
                        $result['resultado'][$value]['denomorgano'] = $denomOrgano;
                    }
                }
            }
            return $result;
        } else
            return 0;
    }

    public function listarOrganoSatisface($params) {
        $datEntidadOrg = new DatEntidadorganosatisface();
        $result = $datEntidadOrg->listarOrganoSatisface($params);
        if (isset($result['resultado'])) {
            return $result;
        } else
            return 0;
    }

    public function adicionarRelacionEntidadOrgano($params) {
        $idEstructura = $params['idEstructura'];
        $idOrganoSatisface = $params['idOrganoSatisface'];
        $resultado = 0;
        if (!empty($idEstructura) && !empty($idOrganoSatisface)) {
            $datEntidadOrg = new DatEntidadorganosatisface();
            $entidadOrganoEmp = $datEntidadOrg->verificarEntidadOrganoEmpresarial($idEstructura);
            if (isset($entidadOrganoEmp[0])) {
                $estructura = Doctrine::getTable('DatEntidadorganosatisface')->findByDql("identidad = '$idEstructura'");
                if (empty($estructura[0]->identidad)) {
                    $organo = Doctrine::getTable('DatEntidadorganosatisface')->findByDql("idorganosatisface = '$idOrganoSatisface'");
                    if (empty($organo[0]->idorganosatisface)) {
                        $datEntidadOrg->identidad = $idEstructura;
                        $datEntidadOrg->idorganosatisface = $idOrganoSatisface;
                        $datEntidadOrg->save();
                        $resultado = 1;
                    } else
                        $resultado = 5; //organo
                } else
                    $resultado = 4; //estructura
            } else
                $resultado = 3; //validar entidad conf como organo emp
        } else
            $resultado = 2; //campos vacios
        return $resultado;
    }

    public function eliminarRelacionEntidadOrgano($arrayIdElementosEliminar) {
        $result = 2;
        if (!empty($arrayIdElementosEliminar[0])) {
            $datEntidadOrg = new DatEntidadorganosatisface();
            $result = $datEntidadOrg->eliminarRelacionEntidadOrgano($arrayIdElementosEliminar);
        }
        return $result;
    }

    public function verificarEntidadOrganoEmpresarial($idEstructura) {
        $resultado = 0;
        if (!empty($idEstructura)) {
            $datEntidadOrg = new DatEntidadorganosatisface();
            $result = $datEntidadOrg->verificarEntidadOrganoEmpresarial($idEstructura);
            if (isset($result[0]))
                $resultado = 1;
        }
        return $resultado;
    }

}
