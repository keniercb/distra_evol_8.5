<?php

/**
 * @author    Osleidy Quiala Fernández
 * @version   1.0.0
 * @copyright ERP-CUBA
 */
class CmphistorialModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatHistorial $datHistorial)
    {
        $datHistorial->save();
    }

    public function Eliminar($datHistorial)
    {
        $datHistorial->delete();
    }

    /**
     * Funcion para listar Actividades
     */
    public function listarActividades($parametros)
    {
        $result = DatHistorial::listarActividades($parametros);
        return $this->listar($result);
    }

    /**
     * Funcion para listar Planes
     */
    public function listarPlanes($parametros)
    {
        $result = DatHistorial::listarPlanes($parametros);
        return $this->listar($result);
    }

    /**
     * Funcion para listar Objetivos
     */
    public function listarObjetivos($parametros)
    {
        $result = DatHistorial::listarObjetivos($parametros);
        return $this->listar($result);
    }

    public function listarFIP($parametros)
    {
        $result = DatHistorial::listarFIP($parametros);
        return $this->listar($result);
    }

    public function listar($result)
    {
        $arrayautores = [];
        foreach ($result->data as $key => $elemento) {
            $result->data[$key]['idautor'] = $elemento['autor'];
            $idautor = $elemento['autor'];
            $nombreautor = $this->nombreAutor($idautor, $arrayautores);
            if ($nombreautor) {
                $result->data[$key]['autor'] = $nombreautor;
            } else {
                $result->data[$key]['autor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $elemento['autor'], 'usuario', null
                );
                $autor['idautor'] = $elemento['autor'];
                $autor['autor'] = $result->data[$key]['autor'];
                array_push($arrayautores, $autor);
            }
        }
        return $result;
    }

    public function nombreAutor($idautor, $arrayautores)
    {
        foreach ($arrayautores as $value => $key) {
            if ($key['idautor'] == $idautor) {
                return $key['autor'];
            }
        }
        return false;
    }

    /**
     * Funcion para eliminar Historial
     */
    public function EliminarHistorial($parametros)
    {
        foreach ($parametros->arrayIdhistorial as $idhistorial) {
            $dathistorial = Doctrine::getTable('DatHistorial')->find(
                $idhistorial
            );
            $dathistorial->delete();
        }
        return 1;
    }

    /**
     * Funcion para ver detalles del historial seleccionado
     */
    function seleccionada($parametros)
    {
        $seleccionada = Doctrine::getTable('DatHistorial')->find(
            $parametros->idhistorial
        )->toArray();
        $seleccionada['idautor'] = $this->integrator->seguridad->nombreUsuario(
            $seleccionada['idautor']
        );
        $involucradoshisto = explode(',', $seleccionada['involucrados']);

        $arregloinvol = array();
        if ($involucradoshisto[0] != null && $involucradoshisto[0] != '') {
            foreach ($involucradoshisto as $key => $involucrado) {
                $arregloinvol[] = $this->integrator->seguridad->nombreUsuario(
                    $involucrado
                );
            }
            $seleccionada['involucrados'] = implode(', ', $arregloinvol);
        } else {
            $seleccionada['involucrados'] = '';
        }
        if ($seleccionada['descelemento'] == null) {
            $seleccionada['descelemento'] = '';
        } else { //para eliminar espacios en blanco y otros caracteres***
            $seleccionada['descelemento'] = trim($seleccionada['descelemento']);
            $seleccionada['descelemento'] = trim(
                $seleccionada['descelemento'], '<br>'
            );
            $seleccionada['descelemento'] = trim(
                $seleccionada['descelemento'], '<br/>'
            );
        }
        if ($seleccionada['participante'] == null) {
            $seleccionada['participante'] = '';
        }
        if ($seleccionada['dirigente'] == null) {
            $seleccionada['dirigente'] = '';
        }
        if ($seleccionada['horainicio'] == null) {
            $seleccionada['horainicio'] = '';
        }
        if ($seleccionada['horafin'] == null) {
            $seleccionada['horafin'] = '';
        }
        if ($seleccionada['estado'] == null) {
            $seleccionada['estado'] = '';
        }
        return $seleccionada;
    }

    /**
     * Funcion para Comparar version actual actividad Historial
     */
    public function comActualActividad($parametros)
    {
        $result = DatHistorial::comActualActividad($parametros);
        if ($result[0] == null || $result[0] == '') {
            return 1;
        } else {
            $result[0]['idautor'] = $this->integrator->seguridad->nombreUsuario(
                $result[0]['idusuariocrea']
            );
            $involucradoshisto = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql("idelemento = '$parametros->idelemento'");
            $arrayinvolucrados = array();
            foreach ($involucradoshisto as $key => $involucrado) {
                $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                    $involucrado->idinvolucrado
                );
                $arrayinvolucrados[] = $involucradosuser->idusuario;
            }

            $arregloinvol = array();
            foreach ($arrayinvolucrados as $key => $involucrado) {
                $arregloinvol[] = $this->integrator->seguridad->nombreUsuario(
                    $involucrado
                );
            }
            $involucradoshisto = implode(', ', $arregloinvol);
            $result[0]['involucrados'] = $involucradoshisto;
            if ($result[0]['descelemento'] == null) {
                $result[0]['descelemento'] = '';
            } else { //para eliminar espacios en blanco y otros caracteres***
                $result[0]['descelemento'] = trim($result[0]['descelemento']);
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br>'
                );
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br/>'
                );
            }
            if ($result[0]['participante'] == null) {
                $result[0]['participante'] = '';
            }
            if ($result[0]['dirigente'] == null) {
                $result[0]['dirigente'] = '';
            }
            if ($result[0]['horainicio'] == null) {
                $result[0]['horainicio'] = '';
            }
            if ($result[0]['horafin'] == null) {
                $result[0]['horafin'] = '';
            }

            $denominacionestadoaporb=DatElementos::getDenominacionEstadoAprob($parametros->idelemento);
            $result[0]['estado'] = $denominacionestadoaporb;

            return $result;
        }
    }

    public function comActualFIP($parametros)
    {
        $result = DatHistorial::comActualFIP($parametros);
        if ($result[0] == null || $result[0] == '') {
            return 1;
        } else {
            $result[0]['idautor'] = $this->integrator->seguridad->nombreUsuario(
                $result[0]['idusuariocrea']
            );
            $involucradoshisto = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql("idelemento = '$parametros->idelemento'");
            $arrayinvolucrados = array();
            foreach ($involucradoshisto as $key => $involucrado) {
                $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                    $involucrado->idinvolucrado
                );
                $arrayinvolucrados[] = $involucradosuser->idusuario;
            }
            $arregloinvol = array();
            foreach ($arrayinvolucrados as $key => $involucrado) {
                $arregloinvol[] = $this->integrator->seguridad->nombreUsuario(
                    $involucrado
                );
            }
            $involucradoshisto = implode(', ', $arregloinvol);
            $result[0]['involucrados'] = $involucradoshisto;
            if ($result[0]['descelemento'] == null) {
                $result[0]['descelemento'] = '';
            } else { //para eliminar espacios en blanco y otros caracteres***
                $result[0]['descelemento'] = trim($result[0]['descelemento']);
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br>'
                );
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br/>'
                );
            }
            if ($result[0]['participante'] == null) {
                $result[0]['participante'] = '';
            }
            if ($result[0]['dirigente'] == null) {
                $result[0]['dirigente'] = '';
            }
            if ($result[0]['horainicio'] == null) {
                $result[0]['horainicio'] = '';
            }
            if ($result[0]['horafin'] == null) {
                $result[0]['horafin'] = '';
            }
            return $result;
        }
    }

    /**
     * Funcion para Comparar version actual objetivos Historial
     */
    public function compactualobjetivo($parametros)
    {
        $result = DatHistorial::compactualobjetivo($parametros);
        if ($result[0] == null || $result[0] == '') {
            return 1;
        } else {
            $result[0]['idautor'] = $this->integrator->seguridad->nombreUsuario(
                $result[0]['idusuariocrea']
            );
            $involucradoshisto = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql("idelemento = '$parametros->idelemento'");
            $arrayinvolucrados = array();
            foreach ($involucradoshisto as $key => $involucrado) {
                $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                    $involucrado->idinvolucrado
                );
                $arrayinvolucrados[] = $involucradosuser->idusuario;
            }
            $arregloinvol = array();
            foreach ($arrayinvolucrados as $key => $involucrado) {
                $arregloinvol[] = $this->integrator->seguridad->nombreUsuario(
                    $involucrado
                );
            }
            $involucradoshisto = implode(', ', $arregloinvol);
            $result[0]['involucrados'] = $involucradoshisto;
            if ($result[0]['descelemento'] == null) {
                $result[0]['descelemento'] = '';
            } else { //para eliminar espacios en blanco y otros caracteres***
                $result[0]['descelemento'] = trim($result[0]['descelemento']);
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br>'
                );
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br/>'
                );
            }
            if ($result[0]['participante'] == null) {
                $result[0]['participante'] = '';
            }
            if ($result[0]['dirigente'] == null) {
                $result[0]['dirigente'] = '';
            }
            if ($result[0]['horainicio'] == null) {
                $result[0]['horainicio'] = '';
            }
            if ($result[0]['horafin'] == null) {
                $result[0]['horafin'] = '';
            }
            return $result;
        }
    }

    /**
     * Funcion para Comparar version actual planes Historial
     */
    public function compactualplan($parametros)
    {
        $result = DatHistorial::compactualplan($parametros);
        if ($result[0] == null || $result[0] == '') {
            return 1;
        } else {
            $result[0]['idautor'] = $this->integrator->seguridad->nombreUsuario(
                $result[0]['idusuariocrea']
            );
            $involucradoshisto = Doctrine::getTable(
                'DatElementosDatInvolucrados'
            )->findByDql("idelemento = '$parametros->idelemento'");
            $arrayinvolucrados = array();
            foreach ($involucradoshisto as $key => $involucrado) {
                $involucradosuser = Doctrine::getTable('DatInvolucrados')->find(
                    $involucrado->idinvolucrado
                );
                $arrayinvolucrados[] = $involucradosuser->idusuario;
            }
            $arregloinvol = array();
            foreach ($arrayinvolucrados as $key => $involucrado) {
                $arregloinvol[] = $this->integrator->seguridad->nombreUsuario(
                    $involucrado
                );
            }
            $involucradoshisto = implode(', ', $arregloinvol);
            $result[0]['involucrados'] = $involucradoshisto;
            if ($result[0]['descelemento'] == null) {
                $result[0]['descelemento'] = '';
            } else { //para eliminar espacios en blanco y otros caracteres***
                $result[0]['descelemento'] = trim($result[0]['descelemento']);
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br>'
                );
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br/>'
                );
            }
            if ($result[0]['participante'] == null) {
                $result[0]['participante'] = '';
            }
            if ($result[0]['dirigente'] == null) {
                $result[0]['dirigente'] = '';
            }
            if ($result[0]['horainicio'] == null) {
                $result[0]['horainicio'] = '';
            }
            if ($result[0]['horafin'] == null) {
                $result[0]['horafin'] = '';
            }
            return $result;
        }
    }

    /**
     * Funcion para Comparar con version Anterior
     */
    function compAnterior($parametros)
    {
        $result = DatHistorial::compAnterior($parametros);
        if ($result[0] == null || $result[0] == '') {
            return 1;
        } else {
            $result[0]['idautor'] = $this->integrator->seguridad->nombreUsuario(
                $result[0]['idautor']
            );
            $involucradoshisto = explode(',', $result[0]['involucrados']);
            $arregloinvol = array();
            if ($involucradoshisto[0] != null && $involucradoshisto[0] != '') {
                foreach ($involucradoshisto as $involucrado) {
                    $arregloinvol[]
                        = $this->integrator->seguridad->nombreUsuario(
                        $involucrado
                    );
                }
                $result[0]['involucrados'] = implode(', ', $arregloinvol);
            } else {
                $result[0]['involucrados'] = '';
            }

            if ($result[0]['descelemento'] == null) {
                $result[0]['descelemento'] = '';
            } else { //para eliminar espacios en blanco y otros caracteres***
                $result[0]['descelemento'] = trim($result[0]['descelemento']);
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br>'
                );
                $result[0]['descelemento'] = trim(
                    $result[0]['descelemento'], '<br/>'
                );
            }
            if ($result[0]['participante'] == null) {
                $result[0]['participante'] = '';
            }
            if ($result[0]['dirigente'] == null) {
                $result[0]['dirigente'] = '';
            }
            if ($result[0]['horainicio'] == null) {
                $result[0]['horainicio'] = '';
            }
            if ($result[0]['horafin'] == null) {
                $result[0]['horafin'] = '';
            }
            if ($result[0]['estado'] == null) {
                $result[0]['estado'] = '';
            }
            return $result;
        }
    }


}


