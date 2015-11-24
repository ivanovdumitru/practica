<?php

namespace B2B\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/products")
 * @Template()
 */

class ProductsController extends Controller{
     public function indexAction($i){
        $connect = $this->get('database_connection');
              $rezult = $connect->fetchAll('select * from items');
                $count = 0;
              foreach($rezult as $item){
                  $count++;
              }
        $nn=$i;
        $nn--;
            $rez= $count/12;
            $m=$i-1;
            $m=$m*12;if($m>0){
            $m--;}
            $company['rezult']= $connect->fetchAll('select * from items  LIMIT 12 OFFSET '.$m);
             $company['respopular'] = $connect->fetchAll('SELECT * FROM companies order by views DESC limit 5');
            $data = [
               'a'=> ++$i,
               'b'=>$nn,
              'items' => $company['rezult'],
              'count' =>  ceil($rez),
              'subjects' => $this->get('post.utility')->subjects(),
              'title' => 'ome',
              'popular' => $company['respopular'],
            
        ];
               return $this->render('B2BBlogBundle:Default:index2.html.twig', compact('data'));
     }
}