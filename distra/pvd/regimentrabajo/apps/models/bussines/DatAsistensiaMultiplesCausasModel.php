<?php

class DatAsistensiaMultiplesCausasModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    static public function AddModMultiplesCausas($post, $modo) {
        if ($modo === 'add') {
            $existe = (new DatAsistenciamultiplescausas())->Existe($post['idpersona'],$post['idcausa'],
                $post['fecharegistro'],$post['horaentrada'],$post['horasalida']);
            
            if (count($existe) > 0) {
                $r['cod'] =3;
                return $r;
            }
            $obj = new DatAsistenciamultiplescausas();
        } elseif ($modo === 'upd') {
            $obj = Doctrine::getTable('DatAsistenciamultiplescausas')->find($post['idasistenciamultiplescausas']);
        }

        $existeEntradaOSalida = DatAsistenciamultiplescausas::extisteHoraEntraSalida($post['idasistencia'], $post['horaentrada'], $post['horasalida'], $post['idasistenciamultiplescausas']);
        $existeSolapamiento = DatAsistenciamultiplescausas::extisteSolapamiento($post['idasistencia'], $post['horaentrada'], $post['horasalida'], $post['idasistenciamultiplescausas']);

        if (count($existeEntradaOSalida) > 0) {
            $r['cod'] = 5;
            return $r;
        }

        if (count($existeSolapamiento) > 0) {
            $r['cod'] = 6;
            return $r;
        }

        $horatt = (new DatAsistencia())->getHorarioByPersona($post['idpersona'], $post['fecharegistro']);

        $fregistroarr = explode('/', $post['fecharegistro']);

        $horaEntradaTurno = $horatt['horaentradaps'];
        $horaSalidaTurno = $horatt['horasalidass'];

        $Het = explode(':', $horaEntradaTurno);
        $horaEntradaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));

        $Het = explode(':', $horaSalidaTurno);
        
        if ($horatt['otrodia'] == 1) {
            $horaSalidaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0] + 1, $fregistroarr[2])));
        } else {
            $horaSalidaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        }

        $a = explode(' ', $post['horaentrada']);
        $b = explode(' ', $post['horasalida']);

        $fechaEntrada = new DateTime($post['horaentrada']);
        $fechaSalida = new DateTime($post['horasalida']);
        
        $obj->idpersona = $post['idpersona'];
        $obj->idcausa = $post['idcausa'];
        $obj->fecharegistro = $post['fecharegistro'];
        $obj->horaentrada = $a[1];
        $obj->horasalida = $b[1];
        $obj->fechaentrada = $fechaEntrada->format('Y-m-d H:i:s');
        $obj->fechasalida = $fechaSalida->format('Y-m-d H:i:s');

        $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
        $TDesc = explode(':', $horatt['tdescanso']);

        $fechaEntradaAlmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        $fechaSalidaAlmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0] + $TDesc[0], $Halmuerzo[1] + $TDesc[1], $Halmuerzo[2] + $TDesc[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        // print_r($fechaEntrada->format('Y-m-d H:i:s'));die;
        
        // $causa = (new NomCausa())->GetCausasById($post['idcausa']);
        $duracionAfectacion = $fechaSalida->getTimestamp() - $fechaEntrada->getTimestamp();

        $tiempoDescanso = 0;
        $solapeInicio = max($fechaEntrada, $fechaEntradaAlmuerzo);
        $solapeFin = min($fechaSalida, $fechaSalidaAlmuerzo);
        
        if ($solapeInicio < $solapeFin) {
            $tiempoDescanso += $solapeFin->getTimestamp() - $solapeInicio->getTimestamp();
        }

        $hora = ($duracionAfectacion - $tiempoDescanso) / 3600;

        $horas = floor($hora);
        $minutos = ($hora - $horas) * 60;

        $horaFormateada = sprintf('%02d:%02d', $horas, $minutos);
        // if($causa[0]['afectasalario']){
        // } else {
        //     $horaFormateada = '00:00'; 
        // }


        $sumHoras = DatAsistenciamultiplescausas::sumHorasMultiplesCausasByIdsAsist($post['idasistencia'], $post['idasistenciamultiplescausas'])[0]['sum'];

        if (self::tiempoASegundos($horaFormateada) + self::tiempoASegundos($sumHoras) > self::tiempoASegundos($horatt['horas'])) {
            $r['cod'] =4;
            return $r;
        }

        $obj->horas = $horaFormateada;
        $obj->observaciones = $post['observaciones'];
        $obj->idasistencia = $post['idasistencia'];
        $obj->save();
        self::actualizarAsistencia($post['idasistencia']);
        $r['cod'] = 1;
        return $r;
    }

    static function actualizarAsistencia($idasistencia, $fHFE = null, $fHFS = null, $actualizar = true)
    {
        // $asistencia = (new DatAsistencia())->getAsistenciaByPerson($idasistencia);
        $asistencia = Doctrine::getTable('DatAsistencia')->find($idasistencia);

        if ($fHFE) {
            $asistencia->fechahoraentrada = $fHFE;
        }

        if ($fHFS) {
            $asistencia->fechahorasalida = $fHFS;
        }
        // $causa = (new NomCausa())->GetCausasById($idcausa);

        $horatt = (new DatAsistencia())->getHorarioByPersona($asistencia->idpersona, $asistencia->fecharegistro);

        $fregistroarr = explode('/', $asistencia->fecharegistro);
        $Halmuerzo = explode(':', $horatt['horarioalmuerzo']);
        $TDesc = explode(':', $horatt['tdescanso']);

        $fechaEntradaAlmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0], $Halmuerzo[1], $Halmuerzo[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        $fechaSalidaAlmuerzo = new DateTime(date('Y-m-d H:i', mktime($Halmuerzo[0] + $TDesc[0], $Halmuerzo[1] + $TDesc[1], $Halmuerzo[2] + $TDesc[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));

        $horaEntradaTurno = $horatt['horaentradaps'];
        $horaSalidaTurno = $horatt['horasalidass'];

        $Het = explode(':', $horaEntradaTurno);
        $horaEntradaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));

        $Het = explode(':', $horaSalidaTurno);
        
        if ($horatt['otrodia'] == 1) {
            $horaSalidaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0] + 1, $fregistroarr[2])));
        } else {
            $horaSalidaTurno = new DateTime(date('Y-m-d H:i', mktime($Het[0], $Het[1], $Het[2], $fregistroarr[1], $fregistroarr[0], $fregistroarr[2])));
        }
        
        
        $horasdescontadas = null;
        
        $mulCausas = DatAsistenciamultiplescausas::getAsistenciasMultiplesCausas($idasistencia);
        
        $mulCausasDate = [];
        
        foreach ($mulCausas as $key => $value) {
            $mulCausasDate[] = [
                $value['fechaentrada_format'],
                $value['fechasalida_format']
            ];
        }
        
        $horaFormateada = '';

        if (count($mulCausas) > 0) {
            $res = self::findFirstAndLastGap($mulCausasDate);
            $hF = $res['first'][0];
            $hS = $res['last'][1];

            $idcausa = -1;

            //
            $hora = 0;
            $fechaEntradaMultiCausa = new DateTime($hF);
            $fechaSalidaMultiCausa = new DateTime($hS);

            $fechaFirmaEntrada = null;
            $fechaFirmaSalida = null;
            if ($asistencia->fechahoraentrada) {
                $fechaFirmaEntrada = DateTime::createFromFormat('d/m/Y H:i:s', $asistencia->fechahoraentrada);
            }
            if ($asistencia->fechahorasalida) {
                $fechaFirmaSalida = DateTime::createFromFormat('d/m/Y H:i:s', $asistencia->fechahorasalida);
            }

            if ($fechaFirmaEntrada && $fechaFirmaEntrada < $fechaEntradaMultiCausa) {
                $fechaEntrada = $fechaFirmaEntrada < $horaEntradaTurno ? $horaEntradaTurno : $fechaFirmaEntrada;

                $duracionAfectacion = $fechaEntrada->getTimestamp() - $horaEntradaTurno->getTimestamp();

                $tiempoDescanso = 0;
                $solapeInicio = max($horaEntradaTurno, $fechaEntradaAlmuerzo);
                $solapeFin = min($fechaEntrada, $fechaSalidaAlmuerzo);
                
                if ($solapeInicio < $solapeFin) {
                    $tiempoDescanso += $solapeFin->getTimestamp() - $solapeInicio->getTimestamp();
                }

                $hora += ($duracionAfectacion - $tiempoDescanso) / 3600;

            } else {
                $fechaEntrada = $fechaEntradaMultiCausa;

                $duracionAfectacion = $fechaEntradaMultiCausa->getTimestamp() - $horaEntradaTurno->getTimestamp();

                $tiempoDescanso = 0;
                $solapeInicio = max($horaEntradaTurno, $fechaEntradaAlmuerzo);
                $solapeFin = min($fechaEntradaMultiCausa, $fechaSalidaAlmuerzo);
                
                if ($solapeInicio < $solapeFin) {
                    $tiempoDescanso += $solapeFin->getTimestamp() - $solapeInicio->getTimestamp();
                }

                $hora += ($duracionAfectacion - $tiempoDescanso) / 3600;
            }

            if ($fechaFirmaSalida && $fechaFirmaSalida > $fechaSalidaMultiCausa) {
                $fechaSalida = $fechaFirmaSalida > $horaSalidaTurno ? $horaEntradaTurno : $fechaFirmaSalida;

                $duracionAfectacion = $horaSalidaTurno->getTimestamp() - $fechaSalida->getTimestamp();
                
                $tiempoDescanso = 0;
                $solapeInicio = max($fechaSalida, $fechaEntradaAlmuerzo);
                $solapeFin = min($horaSalidaTurno, $fechaSalidaAlmuerzo);
                
                if ($solapeInicio < $solapeFin) {
                    $tiempoDescanso += $solapeFin->getTimestamp() - $solapeInicio->getTimestamp();
                }

                $hora += ($duracionAfectacion - $tiempoDescanso) / 3600;
            } else {
                $fechaSalida = $fechaSalidaMultiCausa;

                $duracionAfectacion = $horaSalidaTurno->getTimestamp() - $fechaSalidaMultiCausa->getTimestamp();
                
                $tiempoDescanso = 0;
                $solapeInicio = max($fechaSalidaMultiCausa, $fechaEntradaAlmuerzo);
                $solapeFin = min($horaSalidaTurno, $fechaSalidaAlmuerzo);
                
                if ($solapeInicio < $solapeFin) {
                    $tiempoDescanso += $solapeFin->getTimestamp() - $solapeInicio->getTimestamp();
                }

                $hora += ($duracionAfectacion - $tiempoDescanso) / 3600;
            }


            $horas = floor($hora);
            $minutos = ($hora - $horas) * 60;

            $horaFormateada = sprintf('%02d:%02d', $horas, $minutos);

        } else {
            $hF = null;
            $hS = null;

            $idcausa = null;
        }



        $sumHoras = (new DatAsistenciamultiplescausas())->SumHorasByCausa($idasistencia);
        
        // $horasdescontadas = ($sumHoras[0]['sum'] <= $horatt['horas'])?$sumHoras[0]['sum']:$horatt['horas'];
        $horasdescontadas = (empty($sumHoras[0]['sum']))? '' : $sumHoras[0]['sum'];
        if(empty($horasdescontadas))
            $horasdescontadas = '00:00:00';

        if (self::tiempoASegundos($horaFormateada) > 0) {
            $horasdescontadas = self::SegundosATiempo(self::tiempoASegundos($horaFormateada) + self::tiempoASegundos($horasdescontadas));
        }

        $horastrabajadas = (new DatAsistenciaModel())->RestOnlyTime($horatt['horas'], $horasdescontadas);
        $horasdescontadasaux = explode(':', $horasdescontadas);
        $horastrabajadasaux = explode(':', $horastrabajadas);
        $hrsdescontadas = $horasdescontadasaux[0].':'.$horasdescontadasaux[1];
        $hrstrabajadas = $horastrabajadasaux[0].':'.$horastrabajadasaux[1];
        $hrsdescontadas = (empty($sumHoras[0]['sum']))?'':$hrsdescontadas;
        // $hrstrabajadas = (empty($sumHoras[0]['sum']))?'':$hrstrabajadas;
        
        if (count($mulCausas) > 0 || !empty($sumHoras[0]['sum'])) {
            $hrstrabajadas = $hrstrabajadas;
        } else {
            $hrstrabajadas = '';
        }

        if ($fechaEntrada) {
            $a = $fechaEntrada->format('Y-m-d H:i:s');
        } else {
            $a = null;
        }

        if ($fechaSalida) {
            $b = $fechaSalida->format('Y-m-d H:i:s');
        } else {
            $b = null;
        }


        if ($actualizar) {

            (new DatAsistencia())->UpdateAsistenciaByPerson(
                $idasistencia,
                $hrsdescontadas,
                $hrstrabajadas,
                $hF,
                $hS,
                $idcausa,
                $a,
                $b
            );
        }

        return [
            'idasistencia' => $idasistencia,
            'hrsdescontadas' => $hrsdescontadas,
            'hrstrabajadas' => $hrstrabajadas,
            'fechaentrada' => $a,
            'fechasalida' => $b,
        ];
    }

    static public function tiempoASegundos($tiempo) {
        if ($tiempo) {
            list($horas, $minutos, $segundos) = explode(':', $tiempo);
            return ($horas * 3600) + ($minutos * 60) + $segundos;
        } else {
            return 0;
        }
    }

    static public function SegundosATiempo($tiempo) {
        $hora = $tiempo / 3600;
        $horas = floor($hora);
        $minutos = ($hora - $horas) * 60;

        return sprintf('%02d:%02d', $horas, $minutos);
    }

    static public function findFirstAndLastGap($subRanges) {
        
        $adjustedRanges = [];
        foreach ($subRanges as $range) {
            $startTs = strtotime($range[0]);
            $endTs = strtotime($range[1]);
            
            
            if ($startTs < $endTs) {
                $adjustedRanges[] = [$startTs, $endTs];
            }
        }

        // Ordenar sub-rangos por hora de inicio
        usort($adjustedRanges, function($a, $b) {
            return $a[0] - $b[0];
        });
        
        $firstGap = [$adjustedRanges[0][0], $adjustedRanges[0][1]];
        $lastGap = [$adjustedRanges[0][0], $adjustedRanges[0][1]];
        $currentTs = $adjustedRanges[0][0];
        
        foreach ($adjustedRanges as $range) {
            // Detectar hueco antes del sub-rango actual
            if ($currentTs < $range[0]) {
                $gap = [$currentTs, $range[0]];
                
                // Primer hueco encontrado
                if ($firstGap === null) {
                    $firstGap = $gap;
                }
                
                // Actualizar último hueco detectado
                $lastGap = $gap;
            }
            
            // Actualizar al final del sub-rango actual
            $currentTs = max($currentTs, $range[1]);
        }
        
        // Verificar hueco final después del último sub-rango
        $gap = [$currentTs, $currentTs];
        $lastGap = $gap;
        
        // Convertir a formato de fecha/hora legible
        $formatGap = function($gap) {
            return [
                date('Y-m-d H:i:s', $gap[0]),
                date('Y-m-d H:i:s', $gap[1])
            ];
        };

        return [
            'first' => $firstGap ? $formatGap($firstGap) : null,
            'last' => $lastGap ? $formatGap($lastGap) : null
        ];
    }


}
