<?php
class ReporteTallajeRTF {
	var $rtf;
	var $datos;
	public function ReporteTallajeRTF( $ficha_data)
	{
		$dir=$_SERVER ['DOCUMENT_ROOT'];
		$apps = str_replace('/web','/',$dir);
		require_once($apps.'apps/pvd/comun/recursos/rtf/Rtf.php');
		$this->datos = $ficha_data;
	}
	
	public function CrearFicha()
	{

		$this->rtf = new Rtf();
		$sect = &$this->rtf->addSection();
		$sect->setPaperHeight(27.94);
		$sect->setPaperWidth(21.59);
		$sect->setMargins(1, 1, 1, 1, 1, 1);

		$sect->writeText('<br/><b>Datos de Tallaje</b><br/>', new Font(14, Arial), new ParFormat('center'));
		$sect->writeText('<br/><b>Prenda:'.$this->datos->data[0]['denomprenda'].'</b><br/>', new Font(14, Arial), new ParFormat('left'));

		$table = &$sect->addTable('left');
		$table->addRows(1,1);
		$table->addColumnsList(array(1.5,3.5,6,5.5,2,1.5));
		$table->setDefaultAlignmentOfCells('center',1,1,1,6);
		$table->setVerticalAlignmentOfCells('center',1,1,1,6);
		$cell = &$table->getCell(1, 1);
		$cell->writeText("<b>No.</b>", new Font(14, Arial), new ParFormat('center'));
		$cell1 = &$table->getCell(1, 2);
		$cell1->writeText("<b>No. identidad</b>", new Font(14, Arial), new ParFormat('center'));
		$cell1 = &$table->getCell(1, 3);
		$cell1->writeText("<b>Apellidos y nombres</b>", new Font(14, Arial), new ParFormat('center'));
		$cell1 = &$table->getCell(1, 4);
		$cell1->writeText("<b>Cargo</b>", new Font(14, Arial), new ParFormat('center'));
		$cell1 = &$table->getCell(1, 5);
		$cell1->writeText("<b>Norma</b>", new Font(14, Arial), new ParFormat('center'));
		$cell1 = &$table->getCell(1, 6);
		$cell1->writeText("<b>Talla</b>", new Font(14, Arial), new ParFormat('center'));
		$table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, 1, 6,true,true,true,true);

		$table = &$sect->addTable('left');
		$table->addRows(count($this->datos->data),1);
		$table->addColumnsList(array(1.5,3.5,6,5.5,2,1.5));
		$table->setDefaultAlignmentOfCells('center',1,1,1,6);
		$table->setVerticalAlignmentOfCells('center',1,1,count($this->datos->data),6);
		$table->setBordersOfCells(new BorderFormat(1, "#000000"), 1, 1, count($this->datos->data), 6,true,true,true,true);

		foreach($this->datos->data as $p=>$value) {
			$table->writeToCell($p+1,1, $p+1, new Font(14,Arial), new ParFormat('center'));
			$table->writeToCell($p+1,2, $value['numid'], new Font(14,Arial), new ParFormat());
			$table->writeToCell($p+1,3, $value['nombreyapellidos'], new Font(14,Arial), new ParFormat());
			$table->writeToCell($p+1,4, $value['cargo'], new Font(14,Arial), new ParFormat());
			$table->writeToCell($p+1,5, $value['denomnorma'], new Font(14,Arial), new ParFormat());
			$table->writeToCell($p+1,6, $value['denomtalla'], new Font(14,Arial), new ParFormat());

		}
		$this->rtf->save("Reporte.rtf");
	}	
}