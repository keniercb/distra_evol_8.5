<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 31/01/2018
 * Time: 13:41
 */

class DeficitModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function obtenerDeficit($idest)
    {
        try {
            $ses = $_SESSION['Zeolides']['entidad'];
            $vioc = ZendExt_IoC::getInstance();
            $result = array(
                'datos' => array(),
                'filtros' => array(
                    'estructura' => ($idest == null) ? $ses->denominacion : $idest,
                    'fecha' => date('d/m/Y')
                )
            );
            $sitLaboral = new DatSituacionlaboral();
            $idestructura = ($idest == 0 || $idest == null) ? $ses->idestructura : $idest;
            $cargos = $vioc->metadatos->obtenerCargosEstructura(
                $idestructura,
                true
            );
            $arrcargos = array();
            foreach ($cargos as $k => $v) {
                array_push($arrcargos, $v['idcargo']);
            }
            $datoscargos = $vioc->metadatos->obtenerDatosCargo($arrcargos);
            foreach ($datoscargos as $k => $v) {
                $existe = false;
                foreach ($result['datos'] as $kr => $vr) {
                    if ($v['idnomcargo'] == $vr[0]) {
                        $result['datos'][$kr][2] += $v['cantidad'];
                        // $cant = $sitLaboral->cantSituacionByIdCargo(
                        //     null,
                        //     null,
                        //     array($v['idcargo']),
                        //     1,
                        //     null,
                        //     null,
                        //     null
                        // );
                        $cant = $sitLaboral->getCantPersonaCargo([$v['idcargo']], 2);
                        $result['datos'][$kr][3] += $cant;
                        $result['datos'][$kr][4] = $result['datos'][$kr][2] - $result['datos'][$kr][3];
                        $existe = true;
                    }
                }
                if ($existe == false) {
                    // $cubier = $sitLaboral->cantSituacionByIdCargo(
                    //     null,
                    //     null,
                    //     array($v['idcargo']),
                    //     1,
                    //     null,
                    //     null,
                    //     null
                    // );
                    $cubier = $sitLaboral->getCantPersonaCargo([$v['idcargo']], 2);
                    array_push(
                        $result['datos'],
                        array($v['idnomcargo'], $v['denominacion'], $v['cantidad'], $cubier, $v['cantidad'] - $cubier)
                    );
                }
            }

            $totales = array(0, 0, 0, 0, 0); // Inicializar arreglo de totales
            foreach ($result['datos'] as $fila) {
                // $totales[0] = 0; // Sumar idnomcargo (no sé qué es esto, así que asumo que es un valor numérico)
                // $totales[1] = 0; // No hay nada que sumar en esta columna (denominación)
                $totales[2] += $fila[2]; // Sumar cantidad
                $totales[3] += $fila[3]; // Sumar cubiertos
                $totales[4] += $fila[4]; // Sumar déficit
            }
            $totales[0] = ''; // Asignar valor a la columna de denominación
            $totales[1] = 'Total'; // Asignar valor a la columna de denominación
            array_push($result['datos'], $totales); // Agregar fila "total" al final del arreglo

            return $result;
        } catch (Exception $e) {

        }
    }
}