<?php

class DatEstadoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEstado $datEstado)
    {
        $datEstado->save();
        return true;
    }

    public function Actualizar(DatEstado $datEstado)
    {
        $datEstado->save();
        return true;
    }

    public function Eliminar($datEstado)
    {
        if ($datEstado->delete()) {
            return true;
        }
    }

    public function CargarEstados(
        $denominacion, $idusuariosession, $start, $limit
    ) 
    {        
        $arrayestados = DatEstado::CargarEstados(
            $denominacion, $idusuariosession, $start, $limit
        );
        if (isset($arrayestados['datos'][0])) {
            foreach ($arrayestados['datos'] as $key => $estado) {
                $modifica = 0;
                $elimina = 0;
                $superior = 1;
                if ($estado['idautor'] == $idusuariosession) {
                    $modifica = $elimina = 1;
                    $superior = 0;
                }
                $arrayestados['datos'][$key]['nombreautor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $estado['idautor'], 'usuario', null);
                $arrayestados['datos'][$key]['modifica'] = $modifica;
                $arrayestados['datos'][$key]['elimina'] = $elimina;
                $arrayestados['datos'][$key]['superior'] = $superior;
            }
        }
        return $arrayestados;
    }

}

