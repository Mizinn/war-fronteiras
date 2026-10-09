// Os 6 exércitos do jogo: verde, vermelho, amarelo, azul, preto e branco.
const PCOLORS=[
 {name:"Verde",plural:"Verdes",hex:"#20d47a"},
 {name:"Vermelho",plural:"Vermelhos",hex:"#ff4b4b"},
 {name:"Amarelo",plural:"Amarelos",hex:"#ffd23f"},
 {name:"Azul",plural:"Azuis",hex:"#39a9ff"},
 {name:"Preto",plural:"Pretos",hex:"#1c1c24"},
 {name:"Branco",plural:"Brancos",hex:"#f4f4f4",light:true}
];
// Contornos extraídos da própria imagem war-map.png (coordenadas em 1500x1125): seguem a costa e as fronteiras reais.
const TERRITORIES=[
 {name:"Alasca",continent:"América do Norte",cx:125,cy:306,d:"M60,274 60,282 75,295 76,299 71,303 56,304 53,309 61,319 74,319 79,323 77,328 60,341 60,348 64,352 66,360 74,364 77,370 85,370 93,375 91,382 77,390 72,398 89,392 111,372 113,366 123,366 138,353 160,366 163,366 168,359 221,358 219,353 212,351 201,339 196,325 188,316 188,309 182,296 175,292 171,282 172,274 165,271 158,264 98,244 95,248 77,257 70,269Z"},
 {name:"Mackenzie",continent:"América do Norte",cx:239,cy:317,d:"M398,293 396,288 397,273 392,269 391,264 383,262 383,273 379,278 373,278 368,269 362,270 357,267 349,240 345,236 340,237 336,246 336,257 343,265 346,273 345,279 341,281 328,279 326,284 314,286 303,282 297,273 287,277 284,284 266,286 262,284 262,275 258,272 245,271 234,263 226,263 221,260 215,263 209,258 201,261 190,261 174,273 172,277 176,292 183,296 189,309 189,316 197,325 202,339 212,350 219,352 222,358 343,359 351,340 375,316 375,310 379,302 393,299Z"},
 {name:"Vancouver",continent:"América do Norte",cx:264,cy:399,d:"M164,364 163,370 181,376 188,391 193,395 208,427 216,429 225,436 226,440 235,438 315,438 313,360 168,360Z"},
 {name:"Ottawa",continent:"América do Norte",cx:344,cy:409,d:"M314,361 314,405 317,438 344,438 361,445 371,441 377,442 384,448 395,478 407,475 425,464 407,450 405,422 401,421 396,414 393,397 376,393 362,383 354,381 345,368 343,360Z"},
 {name:"Califórnia",continent:"América do Norte",cx:272,cy:485,d:"M221,446 222,495 227,499 229,509 237,521 250,530 264,558 271,561 272,570 278,571 280,564 264,541 267,532 276,535 304,533 308,529 308,515 311,510 319,510 323,520 329,523 342,523 349,527 356,527 365,511 365,506 357,492 360,478 351,463 352,457 361,448 360,445 344,439 235,439 226,441Z"},
 {name:"Nova York",continent:"América do Norte",cx:392,cy:506,d:"M442,467 439,464 427,463 420,469 395,481 383,448 377,443 368,443 352,459 352,463 361,478 358,492 367,508 358,526 349,528 342,524 329,524 322,520 319,511 311,511 309,529 304,534 299,534 299,538 303,544 316,544 325,558 332,558 334,552 344,545 362,546 368,540 389,544 393,557 400,557 402,552 398,546 398,537 406,527 418,520 418,505 424,501 430,487 442,483Z"},
 {name:"México",continent:"América do Norte",cx:306,cy:562,d:"M267,533 265,541 281,565 291,569 300,585 313,589 313,597 331,607 344,606 359,616 375,620 389,638 394,638 389,627 388,608 374,608 369,604 374,583 362,584 360,591 353,596 341,596 336,592 331,582 332,559 323,558 316,545 303,545 296,535 276,536Z"},
 {name:"Labrador",continent:"América do Norte",cx:448,cy:404,d:"M415,338 413,340 414,362 411,371 415,377 417,389 409,401 409,418 406,421 408,450 423,461 439,463 444,471 458,465 466,471 478,462 476,458 469,457 465,447 466,433 486,431 494,424 503,420 503,410 486,393 481,391 478,376 468,359 465,360 459,371 452,371 448,365 447,354 434,340Z"},
 {name:"Groenlândia",continent:"América do Norte",cx:558,cy:201,d:"M585,117 566,117 555,127 549,124 541,125 543,138 541,143 537,144 526,138 523,147 520,148 513,143 508,143 502,149 495,151 493,158 481,166 478,172 478,177 483,181 482,185 471,189 461,198 461,202 468,205 473,221 492,221 503,226 514,252 513,257 520,264 524,274 523,282 518,288 518,296 533,322 549,326 560,300 576,293 582,286 598,282 610,274 610,270 614,266 614,260 612,257 606,256 603,250 605,247 614,247 617,244 616,237 622,228 618,223 618,217 624,210 617,200 617,195 632,167 643,155 641,150 635,148 629,149 624,154 614,155 610,145 613,135 605,131 595,120Z"},
 {name:"Islândia",continent:"Europa",cx:627,cy:322,d:"M638,325 633,314 629,313 614,317 607,314 603,319 611,329 630,330Z"},
 {name:"Inglaterra",continent:"Europa",cx:683,cy:400,d:"M653,331 658,338 656,367 651,371 642,371 638,382 654,383 664,376 674,384 674,390 667,393 665,400 660,402 663,409 661,416 669,418 682,413 696,412 699,396 692,389 693,383 686,382 684,379 682,366 676,361 678,350 670,343 671,336 668,337ZM656,426 653,428 652,456 666,450 664,439 659,437Z"},
 {name:"Suécia",continent:"Europa",cx:818,cy:303,d:"M892,306 882,300 878,287 862,274 849,270 847,265 840,262 836,254 813,252 809,259 802,260 787,271 769,297 754,329 738,342 740,357 803,373 812,363 836,346 847,335 888,311Z"},
 {name:"Moscou",continent:"Europa",cx:863,cy:396,d:"M890,310 847,336 836,347 812,364 804,373 808,386 817,432 836,456 866,475 875,475 878,467 885,466 899,472 904,477 915,477 921,483 917,495 928,499 922,473 912,463 914,458 925,454 925,452 911,452 903,439 904,430 915,421 914,403 920,393 918,383 911,374 918,343 907,320Z"},
 {name:"Alemanha",continent:"Europa",cx:768,cy:391,d:"M740,358 741,371 751,369 757,374 756,378 748,383 746,388 752,401 741,411 757,412 761,418 756,422 743,420 722,424 719,433 747,452 774,452 777,445 777,411 797,374Z"},
 {name:"Polônia",continent:"Europa",cx:808,cy:460,d:"M799,374 778,411 778,445 776,453 785,465 788,483 796,487 801,494 804,494 807,487 813,483 822,482 832,476 855,472 856,469 836,457 816,432 806,382 803,374Z"},
 {name:"França",continent:"Europa",cx:700,cy:488,d:"M680,475 682,480 682,487 679,492 681,502 694,504 710,502 717,495 719,484 731,476 733,468 747,467 751,464 759,468 760,474 771,482 772,488 779,489 780,495 783,495 785,487 788,486 784,465 775,453 747,453 716,432 703,435 697,440 697,443 707,446 715,455 730,455 731,462 725,465 717,464 714,470 709,473 700,471ZM653,457 653,460 659,462 661,467 668,473 666,452Z"},
 {name:"Argélia",continent:"África",cx:702,cy:583,d:"M730,504 719,506 710,511 702,511 680,525 664,527 648,541 636,564 638,585 635,608 651,629 652,634 675,651 702,648 712,643 728,643 735,651 748,652 756,643 757,638 768,631 775,607 772,568Z"},
 {name:"Egito",continent:"África",cx:800,cy:558,d:"M732,503 757,545 770,561 773,568 776,603 795,596 816,583 831,580 840,573 860,570 852,553 852,548 846,540 846,532 843,529 825,530 802,523 797,524 795,530 780,530 775,525 760,521 758,502Z"},
 {name:"Sudão",continent:"África",cx:839,cy:621,d:"M776,605 769,631 772,631 782,644 799,648 836,665 838,674 849,683 875,725 878,725 878,709 874,703 873,685 877,676 892,660 901,655 911,643 921,625 921,617 892,619 887,609 873,598 871,590 866,585 863,571 840,574 831,581 816,584 795,597Z"},
 {name:"Congo",continent:"África",cx:803,cy:695,d:"M758,638 757,643 749,652 750,660 747,677 751,685 764,694 766,728 764,745 762,748 758,748 758,752 770,750 788,738 793,739 810,733 823,733 838,727 853,728 873,725 848,683 837,674 836,666 799,649 782,645 773,636 772,632Z"},
 {name:"África do Sul",continent:"África",cx:810,cy:778,d:"M876,726 853,729 838,728 823,734 810,734 797,739 786,740 778,747 763,753 764,771 769,779 773,803 786,827 786,836 791,843 824,837 839,821 847,807 849,794 859,788 858,766 866,756 864,740 877,730Z"},
 {name:"Madagascar",continent:"África",cx:899,cy:757,d:"M916,710 913,710 905,723 896,726 892,731 893,746 889,753 891,769 894,771 903,771 906,768 910,751 905,749 903,744 905,741 914,741 919,725Z"},
 {name:"Venezuela",continent:"América do Sul",cx:425,cy:647,d:"M395,671 400,675 410,677 420,688 433,689 435,672 438,669 445,669 451,673 457,673 462,669 460,660 463,658 473,659 476,655 481,654 486,669 491,670 502,666 515,667 519,663 521,655 510,650 494,647 487,639 480,636 469,626 452,628 443,626 437,621 429,623 422,620 409,625 396,643 398,651Z"},
 {name:"Brasil",continent:"América do Sul",cx:535,cy:737,d:"M479,655 470,661 461,660 463,669 457,674 451,674 445,670 436,672 434,697 431,701 422,705 418,718 424,725 431,725 436,730 442,730 447,726 454,725 457,727 460,737 473,742 480,748 481,756 488,759 493,767 494,787 506,793 511,800 514,812 502,826 500,832 519,847 527,839 531,829 537,822 540,805 550,797 561,793 569,793 575,788 583,767 584,746 595,732 601,728 604,720 604,710 601,704 593,701 583,693 577,691 567,692 548,682 542,682 535,686 529,684 527,679 531,670 523,658 515,668 502,667 488,671 483,665 482,656Z"},
 {name:"Peru",continent:"América do Sul",cx:453,cy:761,d:"M392,671 384,677 382,683 384,695 380,701 380,706 390,718 405,750 413,758 427,765 432,773 434,791 426,836 427,844 432,844 436,824 441,814 441,804 447,797 448,792 452,789 467,787 471,778 478,771 491,773 492,767 488,760 480,756 480,750 476,745 458,736 456,727 450,726 442,731 436,731 431,726 424,726 417,718 417,713 423,703 432,699 433,690 420,689 410,678 400,676Z"},
 {name:"Argentina",continent:"América do Sul",cx:467,cy:847,d:"M491,774 478,772 467,788 449,792 448,797 442,804 442,814 437,824 433,844 427,845 423,863 416,879 418,885 416,896 421,905 420,927 417,931 411,933 410,937 413,938 415,944 414,964 416,971 422,977 423,982 426,983 428,990 432,992 432,1000 454,1001 442,987 438,967 454,946 454,941 448,937 447,931 456,923 459,913 463,909 463,901 470,896 474,886 493,881 498,873 498,862 510,859 517,851 517,848 498,832 512,815 512,808 505,793 493,787Z"},
 {name:"Sumatra",continent:"Oceania",cx:1149,cy:763,d:"M1108,722 1108,725 1125,741 1131,752 1138,751 1142,753 1143,757 1139,763 1143,770 1152,779 1162,782 1164,768 1152,755 1150,749 1121,726Z"},
 {name:"Bornéu",continent:"Oceania",cx:1207,cy:744,d:"M1239,712 1228,706 1221,716 1201,728 1199,732 1190,733 1189,741 1195,754 1202,758 1211,757 1222,762 1227,747 1222,746 1220,741 1225,737 1236,736 1233,722 1239,716ZM1259,737 1249,736 1243,740 1243,761 1254,760 1257,749 1256,742Z"},
 {name:"Nova Guiné",continent:"Oceania",cx:1342,cy:773,d:"M1289,740 1290,743 1295,745 1298,754 1309,759 1329,763 1331,778 1336,782 1353,785 1358,779 1368,776 1372,778 1375,785 1388,791 1387,786 1379,776 1378,765 1349,765 1345,763 1345,757 1354,756 1353,752 1329,743 1313,752 1306,748 1302,739 1293,738Z"},
 {name:"Austrália",continent:"Oceania",cx:1332,cy:872,d:"M1209,855 1210,875 1218,891 1220,902 1218,911 1224,915 1229,915 1241,909 1250,909 1265,900 1286,896 1297,900 1308,912 1322,916 1328,930 1343,937 1350,933 1358,934 1369,931 1386,895 1387,873 1384,863 1371,849 1368,842 1356,834 1350,814 1345,811 1339,799 1335,803 1335,821 1332,827 1325,827 1311,819 1308,815 1310,804 1294,799 1278,814 1266,812 1249,826 1243,837 1217,846Z"},
 {name:"Omsk",continent:"Ásia",cx:954,cy:372,d:"M893,280 892,289 895,294 894,304 896,310 909,317 921,342 916,370 917,377 924,383 924,393 918,401 918,408 924,418 928,418 934,424 959,424 959,411 964,403 991,393 997,393 1004,402 1011,405 1022,402 1028,408 1037,424 1040,435 1048,446 1056,444 1064,437 1068,437 1078,428 1075,422 1063,418 1068,408 1067,399 1034,368 1023,363 989,362 974,346 973,341 976,332 974,317 951,314 951,294 943,286 943,279 935,281 927,277 924,281 908,289 904,288 899,280Z"},
 {name:"Dudinka",continent:"Ásia",cx:1020,cy:315,d:"M993,226 990,231 990,239 983,248 984,271 980,273 968,267 959,266 956,275 948,275 944,278 944,286 952,294 952,314 963,313 966,316 975,317 977,332 974,343 989,361 1023,362 1034,367 1068,399 1069,408 1065,418 1072,419 1079,426 1089,425 1105,429 1108,416 1089,415 1082,406 1080,393 1088,384 1089,376 1077,357 1074,343 1064,325 1067,310 1060,290 1060,273 1047,261 1047,241 1039,235 1027,235 1025,240 1021,242 1016,238 1017,233 1009,239 1005,237 1002,226Z"},
 {name:"Sibéria",continent:"Ásia",cx:1121,cy:260,d:"M1130,149 1120,160 1119,166 1110,172 1106,178 1092,177 1084,183 1074,186 1064,195 1059,212 1048,216 1040,216 1038,219 1040,235 1049,243 1047,247 1049,263 1061,273 1061,290 1064,300 1074,306 1076,314 1092,322 1106,319 1127,327 1131,331 1130,354 1175,389 1191,388 1206,380 1208,361 1212,353 1228,351 1238,336 1237,324 1231,318 1220,316 1215,312 1207,292 1206,277 1216,249 1215,233 1207,223 1195,224 1186,216 1175,215 1171,217 1159,211 1155,203 1167,193 1168,177 1158,167 1144,166 1137,158 1134,149Z"},
 {name:"Vladivostok",continent:"Ásia",cx:1286,cy:301,d:"M1209,216 1208,223 1216,233 1217,249 1207,277 1208,292 1216,312 1231,317 1239,327 1239,336 1235,344 1226,353 1213,353 1209,361 1209,367 1214,371 1222,391 1221,412 1228,429 1234,432 1241,441 1254,443 1251,453 1241,460 1241,468 1250,470 1265,457 1267,450 1278,434 1280,408 1274,404 1265,404 1259,397 1272,377 1274,363 1283,361 1293,363 1295,366 1305,365 1306,354 1318,343 1326,344 1329,350 1335,352 1335,358 1323,373 1317,376 1317,381 1311,388 1312,407 1315,416 1319,417 1331,399 1332,391 1338,386 1336,369 1341,359 1359,354 1369,354 1379,344 1403,336 1400,320 1409,307 1423,308 1425,314 1435,318 1443,304 1438,302 1435,295 1428,294 1415,280 1405,276 1392,265 1371,263 1371,272 1366,276 1358,268 1343,266 1331,268 1326,265 1322,252 1296,251 1286,243 1285,238 1275,238 1273,243 1267,247 1258,243 1245,243 1242,249 1235,249 1231,243 1231,223 1228,219Z"},
 {name:"Tchita",continent:"Ásia",cx:1119,cy:385,d:"M1067,304 1068,313 1065,325 1075,343 1078,357 1090,376 1089,384 1081,393 1083,406 1087,413 1117,414 1129,425 1141,425 1154,433 1165,434 1174,428 1179,431 1190,430 1197,418 1196,412 1200,408 1220,409 1221,391 1210,368 1208,368 1207,380 1203,384 1191,389 1175,390 1129,354 1130,331 1127,328 1106,320 1101,320 1096,324 1077,316 1073,306Z"},
 {name:"Aral",continent:"Ásia",cx:997,cy:447,d:"M908,433 906,439 913,447 926,447 932,452 930,459 920,463 930,478 942,477 948,472 955,472 967,486 988,501 993,501 999,497 1004,502 1016,500 1013,492 1014,488 1030,481 1037,475 1038,461 1043,458 1047,449 1027,408 1022,403 1016,403 1013,406 1004,403 997,394 991,394 964,404 961,407 959,416 962,423 959,425 944,424 940,426 934,425 928,419 923,419Z"},
 {name:"Mongólia",continent:"Ásia",cx:1131,cy:450,d:"M1069,436 1071,441 1079,448 1082,458 1096,463 1103,471 1131,475 1156,473 1163,468 1163,463 1166,460 1171,461 1183,451 1192,448 1190,443 1180,444 1178,442 1179,432 1177,430 1172,430 1165,435 1158,435 1141,426 1129,426 1117,415 1109,417 1108,427 1105,430 1083,426Z"},
 {name:"China",continent:"Ásia",cx:1076,cy:502,d:"M1253,443 1243,443 1234,433 1229,431 1220,410 1203,408 1198,411 1198,418 1194,427 1190,431 1180,432 1179,442 1190,442 1193,448 1190,451 1183,452 1171,462 1165,462 1164,468 1156,474 1131,476 1103,472 1096,464 1082,459 1076,445 1068,438 1064,438 1056,445 1048,447 1044,458 1039,461 1038,475 1030,482 1015,488 1014,492 1017,501 1024,508 1034,507 1038,510 1034,530 1041,534 1047,534 1061,544 1086,544 1096,538 1101,538 1113,547 1114,561 1142,561 1142,555 1148,547 1151,548 1151,555 1155,557 1156,561 1181,561 1193,555 1199,546 1200,540 1196,502 1189,498 1189,492 1198,486 1203,487 1205,490 1216,489 1218,496 1224,500 1225,506 1233,511 1234,504 1228,493 1228,488 1237,477 1240,460 1250,453Z"},
 {name:"Índia",continent:"Ásia",cx:1009,cy:526,d:"M961,515 961,525 964,531 963,540 972,539 975,536 988,537 1001,551 1001,561 1010,561 1015,554 1018,554 1021,559 1034,558 1038,561 1055,561 1057,564 1063,564 1065,561 1113,561 1112,547 1101,539 1096,539 1086,545 1066,546 1059,544 1047,535 1037,533 1032,527 1037,510 1034,508 1024,509 1016,501 1004,503 1000,499 993,502 980,501 968,512Z"},
 {name:"Vietnã",continent:"Ásia",cx:1107,cy:577,d:"M1086,562 1085,573 1095,589 1096,598 1107,597 1114,614 1121,610 1124,611 1137,624 1142,624 1151,619 1153,610 1151,599 1144,603 1121,603 1115,597 1116,590 1120,588 1139,589 1146,578 1148,570 1151,569 1161,573 1180,566 1180,562 1156,562 1154,557 1150,555 1150,548 1145,551 1142,562Z"},
 {name:"Japão",continent:"Ásia",cx:1300,cy:562,d:"M1312,539 1309,539 1308,546 1298,556 1291,558 1289,565 1278,566 1275,569 1278,576 1272,580 1273,584 1280,583 1283,577 1307,567 1313,548Z"},
 {name:"Oriente Médio",continent:"Ásia",cx:905,cy:541,d:"M823,485 823,497 829,504 835,507 842,504 847,507 854,505 859,507 860,517 850,537 852,542 859,546 862,554 870,561 875,577 888,593 888,603 892,610 903,610 911,607 928,595 943,588 954,575 954,569 943,563 944,556 980,557 996,568 997,575 1007,576 1008,584 1012,588 1012,602 1016,605 1024,624 1031,626 1036,620 1038,600 1047,595 1057,584 1063,582 1067,575 1077,574 1084,570 1085,562 1065,562 1060,566 1055,562 1038,562 1034,559 1024,561 1018,555 1015,555 1010,562 1001,562 1000,551 988,538 975,537 972,540 963,541 960,515 982,500 982,497 967,487 955,473 948,473 942,478 931,479 930,487 933,500 927,505 919,503 913,498 914,484 911,481 903,480 897,475 881,470 881,479 877,481 847,477 840,482Z"}
];

// Ligações terrestres e marítimas (as linhas brancas do tabuleiro). Tudo é simétrico: A→B vale também B→A.
const LINKS={
 "Alasca":["Mackenzie","Vancouver","Vladivostok"],
 "Mackenzie":["Vancouver","Ottawa","Groenlândia"],
 "Vancouver":["Ottawa","Califórnia"],
 "Ottawa":["Califórnia","Nova York","Labrador"],
 "Califórnia":["Nova York","México"],
 "Nova York":["México","Labrador"],
 "México":["Venezuela"],
 "Labrador":["Groenlândia"],
 "Groenlândia":["Islândia"],
 "Islândia":["Inglaterra"],
 "Inglaterra":["Suécia","Alemanha","França"],
 "França":["Alemanha","Polônia","Argélia","Egito"],
 "Alemanha":["Polônia","Suécia"],
 "Polônia":["Suécia","Moscou","Oriente Médio","Egito"],
 "Suécia":["Moscou"],
 "Moscou":["Omsk","Aral","Oriente Médio"],
 "Omsk":["Dudinka","Tchita","Mongólia","Aral"],
 "Dudinka":["Sibéria","Tchita"],
 "Sibéria":["Tchita","Vladivostok"],
 "Vladivostok":["Tchita","China","Japão"],
 "Tchita":["Mongólia","China"],
 "Aral":["Mongólia","China","Índia","Oriente Médio"],
 "Mongólia":["China"],
 "China":["Índia","Vietnã","Japão"],
 "Índia":["Vietnã","Oriente Médio","Sumatra"],
 "Vietnã":["Bornéu"],
 "Oriente Médio":["Egito","Sudão"],
 "Egito":["Argélia","Sudão"],
 "Argélia":["Sudão","Congo","Brasil"],
 "Sudão":["Congo","África do Sul","Madagascar"],
 "Congo":["África do Sul"],
 "África do Sul":["Madagascar"],
 "Venezuela":["Brasil","Peru"],
 "Brasil":["Peru","Argentina"],
 "Peru":["Argentina"],
 "Sumatra":["Austrália"],
 "Bornéu":["Nova Guiné","Austrália"],
 "Nova Guiné":["Austrália"]
};
const ADJ={};
TERRITORIES.forEach(t=>ADJ[t.name]=[]);
Object.entries(LINKS).forEach(([a,list])=>list.forEach(b=>{
 if(!ADJ[a]||!ADJ[b]){console.error("Ligação inválida:",a,b);return}
 if(!ADJ[a].includes(b))ADJ[a].push(b);
 if(!ADJ[b].includes(a))ADJ[b].push(a);
}));
const CONTINENT_BONUS={"América do Norte":5,"Europa":5,"Ásia":7,"América do Sul":2,"África":3,"Oceania":2};
const BY_NAME=Object.fromEntries(TERRITORIES.map(t=>[t.name,t]));
const SVGNS="http://www.w3.org/2000/svg";
const EXTRA_START=20;           // exércitos extras do posicionamento inicial
const SYMBOLS=["■","●","▲"];    // quadrado, círculo, triângulo
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// ---- objetivos (cartas secretas) ----
const OBJ24="Conquistar 24 territórios à sua escolha.";
const OBJECTIVES=[
 {type:"conts",must:["Europa","Oceania"],any:1,text:"Conquistar na totalidade a Europa, a Oceania e mais um terceiro continente à sua escolha."},
 {type:"conts",must:["Ásia","América do Sul"],any:0,text:"Conquistar na totalidade a Ásia e a América do Sul."},
 {type:"conts",must:["Ásia","África"],any:0,text:"Conquistar na totalidade a Ásia e a África."},
 {type:"conts",must:["América do Norte","África"],any:0,text:"Conquistar na totalidade a América do Norte e a África."},
 {type:"conts",must:["América do Norte","Oceania"],any:0,text:"Conquistar na totalidade a América do Norte e a Oceania."},
 {type:"conts",must:["América do Sul","Europa"],any:1,text:"Conquistar na totalidade a América do Sul, a Europa e mais um terceiro continente à sua escolha."},
 {type:"terr24",text:OBJ24}
];
PCOLORS.forEach((c,i)=>OBJECTIVES.push({type:"destroy",color:i,text:`Destruir totalmente os exércitos ${c.plural}.`}));

/* =====================================================================
   ARQUITETURA
   S  = estado COMPLETO da partida. Só existe no anfitrião (ou no modo solo).
   V  = "visão" deste jogador: o que o anfitrião mandou para ele (sem as cartas,
        objetivos e alianças dos outros). A interface lê SEMPRE de V.
   U  = estado só da tela (modo ataque, origem escolhida, cartas marcadas...).
   Os jogadores mandam comandos (act) ao anfitrião, que valida, aplica e
   devolve a visão atualizada de cada um (sync).
   ===================================================================== */
let S=null,V=null;
const U={me:0,attack:false,source:null,busy:false,pending:null,sel:[],showObj:false,draggingReserve:false,
         chat:[],chatTo:"all",tab:"game",unread:0,endShown:false,elimShown:false,rollT0:0,rollTimer:null,abortTimer:null,fromRoll:null};

// ---------- utilidades de estado (st = S ou V) ----------
const ownedIn=(st,p)=>TERRITORIES.filter(t=>st.data[t.name].owner===p);
function fullContsIn(st,p){
 const names=new Set(ownedIn(st,p).map(t=>t.name));
 return Object.keys(CONTINENT_BONUS).filter(c=>TERRITORIES.filter(t=>t.continent===c).every(t=>names.has(t.name)));
}
const totalResIn=(st,p)=>(st.res[p]||0)+Object.values(st.cres[p]||{}).reduce((a,b)=>a+b,0);
const pnameIn=(st,p)=>`${st.names[p]} (${PCOLORS[st.pc[p]].name})`;
const colIn=(st,p)=>PCOLORS[st.pc[p]].hex;
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
// reforços: territórios ÷ 2 (mínimo 3) + bônus de continente (esse só vale dentro do continente)
function calcReinforcements(st,p){
 const free=Math.max(3,Math.floor(ownedIn(st,p).length/2));
 const cont={};fullContsIn(st,p).forEach(c=>cont[c]=CONTINENT_BONUS[c]);
 return {free,cont};
}
function connectedIn(st,a,b){
 const me=st.data[a].owner,seen=new Set([a]),q=[a];
 while(q.length){const x=q.shift();if(x===b)return true;ADJ[x].forEach(y=>{if(!seen.has(y)&&st.data[y].owner===me){seen.add(y);q.push(y)}})}
 return false;
}

// ---------- cartas ----------
function validSet(cs){
 if(cs.length!==3||cs.some(c=>!c))return false;
 if(cs.some(c=>c.wild))return true;                 // 2 cartas quaisquer + coringa
 const n=new Set(cs.map(c=>c.sym)).size;
 return n===1||n===3;                                // 3 iguais ou 3 diferentes
}
function tradeValue(n){return n<=5?[4,6,8,10,12][n-1]:15+5*(n-6)}   // 4,6,8,10,12,15,20,25,30…
function findSet(hand){
 for(const allowWild of [false,true])
  for(let i=0;i<hand.length;i++)for(let j=i+1;j<hand.length;j++)for(let k=j+1;k<hand.length;k++){
   const cs=[hand[i],hand[j],hand[k]];
   if(!allowWild&&cs.some(c=>c.wild))continue;
   if(validSet(cs))return [i,j,k];
  }
 return null;
}

/* =====================================================================
   ANFITRIÃO: motor da partida
   ===================================================================== */
const pname=p=>pnameIn(S,p);
const owned=p=>ownedIn(S,p);
const totalRes=p=>totalResIn(S,p);
const humans=()=>S.alive.filter(p=>S.human[p]);

function logPub(t){S.human.forEach((h,p)=>{if(h)send(p,{k:"log",text:t})})}
function logTo(p,t){if(S&&S.human[p])send(p,{k:"log",text:t})}
function sysTo(p,t){if(S&&S.human[p])send(p,{k:"chat",sys:true,text:t})}

function initGame(c){
 const n=c.names.length;
 S={players:n,names:c.names,pc:c.pc,human:c.human,cfg:c.cfg,peers:c.peers||[],alive:[...Array(n).keys()],cur:0,phase:"place",setup:true,
    over:false,winner:null,winText:"",data:{},res:Array(n).fill(0),cres:Array.from({length:n},()=>({})),conq:Array(n).fill(false),
    hands:Array.from({length:n},()=>[]),deck:[],discard:[],trades:0,obj:[],killedBy:{},allies:[],props:[]};
 // baralho: 42 cartas de território (■ ● ▲) + 2 coringas
 S.deck=shuffle([...TERRITORIES.map((t,i)=>({t:t.name,sym:SYMBOLS[i%3]})),{t:"Coringa",sym:"★",wild:true},{t:"Coringa",sym:"★",wild:true}]);
 // sorteio dos territórios: todos os 42 distribuídos igualmente, 1 exército em cada
 shuffle(TERRITORIES.map(t=>t.name)).forEach((nm,i)=>S.data[nm]={owner:i%n,troops:1});
 // objetivos secretos (um por jogador, sem repetir)
 const objs=shuffle(OBJECTIVES.map(o=>({...o})));
 S.obj=S.alive.map(p=>{
  const o=objs[p];
  if(o.type==="destroy"){
   const target=S.pc.indexOf(o.color);
   if(target<0||target===p)return {type:"terr24",text:OBJ24,auto:true}; // cor própria ou fora do jogo
  }
  return o;
 });
 // posicionamento inicial extra: CPUs distribuem na hora; humanos arrastam da caixa
 S.alive.forEach(p=>{if(S.human[p])S.res[p]=EXTRA_START;else cpuPlace(p,EXTRA_START,null)});
 logPub(`Partida iniciada: ${n} jogadores. Todos os 42 territórios foram sorteados (1 exército em cada).`);
 logPub(`Posicione seus ${EXTRA_START} exércitos extras. O objetivo secreto de cada um está no painel OBJETIVO.`);
 sync();
}

function sync(){
 if(!S)return;
 S.human.forEach((h,p)=>{if(h)send(p,{k:"state",s:snapshotFor(p)})});
}
function allyOf(p){const a=S.allies.find(x=>x[0]===p||x[1]===p);return a?(a[0]===p?a[1]:a[0]):null}
const areAllies=(a,b)=>allyOf(a)===b;
function snapshotFor(p){
 return {players:S.players,names:S.names,pc:S.pc,human:S.human,cfg:S.cfg,peers:S.peers,alive:S.alive,cur:S.cur,phase:S.phase,setup:S.setup,
  over:S.over,winner:S.winner,winText:S.winText,data:S.data,res:S.res,cres:S.cres,trades:S.trades,killedBy:S.killedBy,
  handCounts:S.hands.map(h=>h.length),hand:S.hands[p],obj:S.cfg.mission?S.obj[p]:null,
  ally:allyOf(p),propIn:S.props.filter(x=>x.to===p).map(x=>x.from),propOut:S.props.filter(x=>x.from===p).map(x=>x.to),me:p};
}

// ----- comandos vindos dos jogadores (inclusive do próprio anfitrião) -----
function execCmd(p,c){
 if(!S||S.over||!S.alive.includes(p))return;
 const err=t=>logTo(p,"⚠ "+t);
 const myTurn=()=>!S.setup&&S.cur===p;
 switch(c.t){
  case "place":{
   const terr=c.terr;
   if(!BY_NAME[terr]||S.data[terr].owner!==p)return err("Você só pode adicionar tropas em um território seu.");
   if(S.setup){if(totalRes(p)<=0)return err("Você já posicionou todas as tropas iniciais.")}
   else{
    if(S.cur!==p)return err("Não é seu turno.");
    if(S.phase!=="place")return err("A fase de posicionar já acabou neste turno.");
    if(totalRes(p)<=0)return err("Você não tem tropas disponíveis na caixa.");
   }
   const cont=BY_NAME[terr].continent;
   if(S.cres[p][cont]>0)S.cres[p][cont]--;               // bônus do continente: só vale dentro dele
   else if(S.res[p]>0)S.res[p]--;
   else return err(`As tropas restantes são bônus de continente e só podem ficar em: ${Object.keys(S.cres[p]).filter(k=>S.cres[p][k]>0).join(", ")}.`);
   S.data[terr].troops++;
   logTo(p,`+1 tropa adicionada em ${terr}.`);
   if(S.setup&&humans().every(q=>totalRes(q)===0)){
    S.setup=false;logPub("Posicionamento inicial concluído. Começa a primeira rodada!");startTurn(S.alive[0]);return;
   }
   break}
  case "phase":{
   if(!myTurn())return err("Não é seu turno.");
   if(S.phase==="fortify")return err("Você já está no remanejamento: só falta encerrar o turno.");
   if(totalRes(p)>0)return err("Posicione todas as tropas da caixa antes de continuar.");
   S.phase=c.to==="fortify"?"fortify":"attack";
   break}
  case "attack":{
   if(!myTurn()||S.phase!=="attack")return err("Você só ataca no seu turno, na fase de ataque.");
   const {from,to}=c;
   if(!BY_NAME[from]||!BY_NAME[to])return;
   if(S.data[from].owner!==p||S.data[to].owner===p)return err("Origem deve ser sua e o alvo, inimigo.");
   if(!ADJ[from].includes(to))return err("Esse ataque não é permitido: os territórios não são vizinhos.");
   if(S.data[from].troops<2)return err("Você precisa de pelo menos 2 tropas para atacar.");
   const def=S.data[to].owner;
   if(areAllies(p,def))return err(`Você tem uma aliança secreta com ${pname(def)}. Rompa-a no painel ALIANÇAS antes de atacar.`);
   const na=Math.max(1,Math.min(Number(c.n)||1,3,S.data[from].troops-1)),nd=Math.min(3,S.data[to].troops);
   const r=fight(from,to,na,nd);
   const ev={from,to,att:p,def,na,nd,ad:r.ad,dd:r.dd,al:r.al,dl:r.dl,conquered:r.conquered,attName:pname(p),defName:pname(def)};
   send(p,{k:"combat",ev});if(S.human[def]&&def!==p)send(def,{k:"combat",ev});
   logPub(`${pname(p)} atacou ${to} (${pname(def)}) de ${from} com ${na} dado(s). Perdas: ${r.al} contra ${r.dl}.${r.conquered?` 🏆 Conquistou ${to}!`:""}`);
   checkEnd(p);
   break}
  case "fortify":{
   if(!myTurn()||S.phase!=="fortify")return err("Remanejamento só na fase de remanejar do seu turno.");
   const {from,to}=c;
   if(!BY_NAME[from]||!BY_NAME[to]||from===to)return;
   if(S.data[from].owner!==p||S.data[to].owner!==p)return err("Movimentação somente entre territórios seus.");
   if(!connectedIn(S,from,to))return err("Os territórios não estão conectados por territórios seus.");
   if(S.data[from].troops<=1)return err("Deixe pelo menos 1 tropa na origem.");
   S.data[from].troops--;S.data[to].troops++;
   logTo(p,`1 tropa movida de ${from} para ${to}.`);
   break}
  case "end":{
   if(!myTurn())return err("Não é seu turno.");
   if(totalRes(p)>0)return err(`Você ainda tem ${totalRes(p)} tropa(s) na caixa. Posicione todas antes de encerrar.`);
   endTurnFor(p);return}
  case "trade":{
   if(!myTurn()||S.phase!=="place")return err("A troca de cartas só pode ser feita no início do turno, antes de atacar.");
   const idx=[...new Set((c.idx||[]).map(Number))];
   if(idx.length!==3||idx.some(i=>!S.hands[p][i]))return err("Escolha 3 cartas.");
   if(!validSet(idx.map(i=>S.hands[p][i])))return err("Combinação inválida.");
   const r=tradeCards(p,idx);S.res[p]+=r.armies;
   logPub(`${pname(p)} trocou cartas (troca nº ${S.trades}): +${r.armies} exércitos${r.bonus.length?` e +2 em ${r.bonus.join(", ")}`:""}.`);
   break}
  case "propose":proposeAlly(p,Number(c.to));break;
  case "answer":answerAlly(p,Number(c.from),!!c.accept);break;
  case "break":breakAlly(p,Number(c.with),false);break;
 }
 sync();
}

function drawCard(p){
 if(!S.deck.length)S.deck=shuffle(S.discard.splice(0));
 if(!S.deck.length)return null;
 const c=S.deck.pop();S.hands[p].push(c);return c;
}
// Troca 3 cartas: exércitos da tabela + 2 extras em cada território da carta que o jogador controla
function tradeCards(p,idx){
 const hand=S.hands[p],cards=idx.map(i=>hand[i]);
 const armies=tradeValue(++S.trades);
 const bonus=[];
 cards.forEach(c=>{if(!c.wild&&S.data[c.t].owner===p){S.data[c.t].troops+=2;bonus.push(c.t)}});
 idx.slice().sort((a,b)=>b-a).forEach(i=>hand.splice(i,1));
 S.discard.push(...cards);
 return {armies,bonus};
}

// ----- turnos -----
function startTurn(q){
 S.cur=q;S.phase="place";S.conq[q]=false;
 const r=calcReinforcements(S,q);S.res[q]=r.free;S.cres[q]=r.cont;
 const bonus=Object.entries(r.cont).map(([c,n])=>`+${n} (${c})`).join(" ");
 logPub(`Turno de ${pname(q)}: ${r.free} tropas por ${owned(q).length} territórios${bonus?" "+bonus:""}.`);
 if(!S.human[q]){
  setTimeout(()=>{if(S.over||S.cur!==q||S.human[q])return;cpuTurn(q);if(!S.over){endTurnFor(q)}},900);
 }
 sync();
}
function endTurnFor(p){
 if(S.conq[p]){const c=drawCard(p);if(c&&S.human[p])logTo(p,`Você conquistou território(s) e comprou a carta ${c.wild?"Coringa ★":c.t+" "+c.sym}.`)}
 let q=p;
 do{q=(q+1)%S.players}while(!S.alive.includes(q));
 startTurn(q);
}
// jogador humano saiu: a vaga vira CPU
function dropSeat(p){
 if(!S||!S.human[p])return;
 S.human[p]=false;S.names[p]=S.names[p]+" (CPU)";
 logPub(`${S.names[p]} saiu da partida e foi substituído pela CPU.`);
 if(S.setup){cpuPlace(p,totalRes(p),null);S.res[p]=0;S.cres[p]={};
  if(humans().every(q=>totalRes(q)===0)&&humans().length){S.setup=false;startTurn(S.alive[0]);return}}
 else if(S.cur===p){startTurn(p);return}
 if(!humans().length&&!S.over){S.over=true;S.winText="Todos os jogadores humanos saíram.";}
 sync();
}

// ----- combate -----
function rollDice(n){return Array.from({length:n},()=>1+Math.floor(Math.random()*6)).sort((x,y)=>y-x)}
// 1 a 3 dados cada lado; maior x maior, 2º x 2º, 3º x 3º; empate é da defesa.
function fight(from,to,na,nd){
 const a=S.data[from],d=S.data[to],prev=d.owner,att=a.owner;
 const ad=rollDice(na),dd=rollDice(nd);
 let al=0,dl=0;
 for(let i=0;i<Math.min(na,nd);i++) ad[i]>dd[i]?dl++:al++;
 a.troops-=al;d.troops-=dl;
 let conquered=false;
 if(d.troops<=0){
   conquered=true;
   // obrigatório mover tantos exércitos quanto dados usados (sempre deixando 1 na origem)
   const mv=Math.min(na,a.troops-1);
   d.owner=att;d.troops=mv;a.troops-=mv;
   S.conq[att]=true;
   handleElimination(prev,att);
 }
 return {ad,dd,al,dl,conquered};
}

// ----- objetivos / fim de jogo -----
function objDone(p){
 if(!S.cfg.mission)return false;
 const o=S.obj[p];if(!o)return false;
 if(o.type==="terr24")return owned(p).length>=24;
 if(o.type==="destroy"){const t=S.pc.indexOf(o.color);return t>=0&&S.killedBy[t]===p}
 const f=fullContsIn(S,p);
 return o.must.every(c=>f.includes(c))&&f.filter(c=>!o.must.includes(c)).length>=(o.any||0);
}
function handleElimination(prev,killer){
 if(owned(prev).length||!S.alive.includes(prev))return;
 S.alive=S.alive.filter(x=>x!==prev);S.killedBy[prev]=killer;
 S.allies=S.allies.filter(x=>!x.includes(prev));S.props=S.props.filter(x=>x.from!==prev&&x.to!==prev);
 logPub(`${pname(prev)} foi eliminado por ${pname(killer)}.`);
 // quem tinha de destruir essa cor, mas não foi quem a eliminou, passa a ter de conquistar 24 territórios
 S.alive.forEach(p=>{
  const o=S.obj[p];
  if(o&&o.type==="destroy"&&o.color===S.pc[prev]&&p!==killer){
   S.obj[p]={type:"terr24",text:OBJ24,auto:true};
   logTo(p,"Seu objetivo mudou: outro jogador eliminou a cor-alvo. Agora: conquistar 24 territórios.");
  }
 });
}
function checkEnd(actor){
 if(S.over)return;
 const order=S.alive.includes(actor)?[actor,...S.alive.filter(p=>p!==actor)]:S.alive;
 for(const p of order)if(objDone(p)){declareWinner(p);return}
 if(S.alive.length===1){declareWinner(S.alive[0]);return}
 if(!humans().length){S.over=true;S.winText="Todos os jogadores humanos foram eliminados.";logPub(S.winText)}
}
function declareWinner(p){
 S.over=true;S.winner=p;
 S.winText=S.cfg.mission?`${pname(p)} cumpriu o objetivo: ${S.obj[p].text}`:`${pname(p)} dominou o mundo.`;
 logPub("🏆 "+S.winText);
}

// ----- alianças secretas -----
function canAlly(a,b){return S.cfg.alliance&&a!==b&&S.alive.includes(a)&&S.alive.includes(b)&&allyOf(a)==null&&allyOf(b)==null}
function proposeAlly(from,to){
 if(!S.cfg.alliance)return logTo(from,"⚠ Alianças estão desativadas nesta sala.");
 if(!Number.isInteger(to)||!S.alive.includes(to)||to===from)return;
 if(allyOf(from)!=null)return logTo(from,"⚠ Você já tem um aliado. Rompa a aliança atual para fazer outra.");
 if(allyOf(to)!=null)return logTo(from,"⚠ Esse jogador já tem um aliado.");
 if(S.props.some(x=>x.from===from&&x.to===to))return;
 if(S.props.some(x=>x.from===to&&x.to===from)){return answerAlly(from,to,true)}     // proposta cruzada = aceita
 S.props.push({from,to});
 sysTo(from,`🤝 Proposta de aliança secreta enviada a ${pname(to)}.`);
 if(S.human[to])sysTo(to,`🤝 ${pname(from)} propõe uma aliança secreta. Responda no painel ALIANÇAS.`);
 else setTimeout(()=>{
  if(!S||S.over||!S.props.some(x=>x.from===from&&x.to===to))return;
  answerAlly(to,from,Math.random()<0.55);sync();
 },1500+Math.random()*1500);
}
function answerAlly(p,from,accept){
 const i=S.props.findIndex(x=>x.from===from&&x.to===p);
 if(i<0)return;
 S.props.splice(i,1);
 if(accept&&canAlly(p,from)){
  S.allies.push([from,p]);
  S.props=S.props.filter(x=>![x.from,x.to].some(q=>q===p||q===from));
  sysTo(from,`🤝 ${pname(p)} aceitou! Aliança secreta formada: vocês não podem atacar um ao outro.`);
  sysTo(p,`🤝 Aliança secreta com ${pname(from)} formada: vocês não podem atacar um ao outro.`);
 }else{
  sysTo(from,`✖ ${pname(p)} recusou a aliança.`);
  if(S.human[p])sysTo(p,`Você recusou a aliança de ${pname(from)}.`);
 }
}
function breakAlly(p,other,silentFor){
 if(!areAllies(p,other))return;
 S.allies=S.allies.filter(x=>!(x.includes(p)&&x.includes(other)));
 sysTo(other,`💔 ${pname(p)} rompeu a aliança secreta com você.`);
 sysTo(p,`💔 Você rompeu a aliança com ${pname(other)}.`);
}

// ----- chat (público e privado) -----
const CPU_REPLIES=["Entendido.","Hmm… vou pensar nisso.","Não confio em ninguém neste tabuleiro 😏","Interessante. Vamos ver o que acontece.","Boa sorte no próximo turno!","Cuidado com as suas fronteiras.","Se quer paz, proponha uma aliança… no painel.","Estou de olho em você."];
function handleChat(from,m){
 if(!S||!S.human[from])return;
 const text=String(m.text||"").slice(0,300).trim();if(!text)return;
 const to=m.to===null||m.to==="all"||m.to==null?null:Number(m.to);
 if(to!==null&&(!Number.isInteger(to)||to<0||to>=S.players||to===from))return;
 const msg={k:"chat",from,to,text,fromName:S.names[from],toName:to===null?null:S.names[to],t:Date.now()};
 if(to===null){S.human.forEach((h,p)=>{if(h)send(p,msg)})}
 else{
  if(S.human[from])send(from,msg);
  if(S.human[to])send(to,msg);
  else if(S.alive.includes(to)&&S.cfg.chatReplies!==false)setTimeout(()=>{
   if(!S||S.over)return;
   const r={k:"chat",from:to,to:from,text:CPU_REPLIES[Math.floor(Math.random()*CPU_REPLIES.length)],fromName:S.names[to],toName:S.names[from],t:Date.now()};
   if(S.human[from])send(from,r);
  },1200+Math.random()*1500);
 }
}

// ----- CPU -----
function cpuPlace(p,n,continent){
 for(;n>0;n--){
   let mine=owned(p).filter(t=>!continent||t.continent===continent);
   if(!mine.length)mine=owned(p);
   const b=mine.filter(t=>ADJ[t.name].some(x=>S.data[x].owner!==p));
   const pool=b.length?b:mine;
   S.data[pool[Math.floor(Math.random()*pool.length)].name].troops++;
 }
}
function cpuTurn(p){
 if(!owned(p).length)return;
 // diplomacia
 if(S.cfg.alliance){
  const al=allyOf(p);
  if(al!=null&&Math.random()<0.07)breakAlly(p,al,true);
  else if(al==null&&Math.random()<0.12){
   const hs=S.alive.filter(q=>q!==p&&S.human[q]&&allyOf(q)==null&&!S.props.some(x=>x.from===p&&x.to===q));
   if(hs.length)proposeAlly(p,hs[Math.floor(Math.random()*hs.length)]);
  }
 }
 // troca cartas sempre que puder
 let extra=0,s;
 while((s=findSet(S.hands[p]))){const r=tradeCards(p,s);extra+=r.armies;logPub(`${pname(p)} trocou cartas (+${r.armies}).`)}
 const r=calcReinforcements(S,p);
 cpuPlace(p,r.free+extra,null);
 Object.entries(r.cont).forEach(([c,n])=>cpuPlace(p,n,c));
 // ataques com vantagem (nunca contra aliado)
 let won=0,tries=0;
 while(tries++<25&&!S.over){
   const opts=[];
   owned(p).forEach(t=>{
     const a=S.data[t.name];if(a.troops<3)return;
     ADJ[t.name].forEach(n=>{const d=S.data[n];if(d.owner!==p&&!areAllies(p,d.owner)&&a.troops>=d.troops+2)opts.push([t.name,n])});
   });
   if(!opts.length)break;
   const [from,to]=opts[Math.floor(Math.random()*opts.length)];
   const prev=S.data[to].owner;
   while(S.data[from].troops>=3&&S.data[to].owner!==p&&S.data[from].troops>=S.data[to].troops+1){
     fight(from,to,Math.min(3,S.data[from].troops-1),Math.min(3,S.data[to].troops));
   }
   if(S.data[to].owner===p){won++;logPub(`${pname(p)} conquistou ${to}${S.human[prev]?" de "+pname(prev):""}.`)}
   checkEnd(p);
 }
 logPub(`${pname(p)} jogou: ${won} território(s) conquistado(s).`);
}

/* =====================================================================
   CLIENTE (todos, inclusive o anfitrião): recebe mensagens e desenha
   ===================================================================== */
function act(cmd){
 if(NET.mode==="client"){if(NET.hostConn&&NET.hostConn.open)NET.hostConn.send({k:"cmd",cmd});return}
 execCmd(U.me,cmd);
}
function onMsg(m){
 switch(m.k){
  case "state":
   if(U.busy){U.pending=m.s;return}
   V=m.s;render();break;
  case "log":log(m.text);break;
  case "chat":addChat(m);break;
  case "combat":showCombat(m.ev);break;
 }
}
function log(t){const l=$("log");if(!l)return;const d=document.createElement("div");d.textContent="• "+t;l.appendChild(d);l.scrollTop=l.scrollHeight;}
const col=p=>colIn(V,p);
const pn=p=>pnameIn(V,p);
const myTurn=()=>V&&!V.over&&!V.setup&&V.cur===U.me&&V.alive.includes(U.me);

function render(){
 if(!V)return;
 if(!(V.phase==="attack"&&V.cur===U.me&&!V.setup)){U.attack=false;U.source=null}
 draw();update();
 if(typeof renderSocial==="function")renderSocial();
 if(V.over&&!U.endShown){U.endShown=true;showEnd()}
 else if(!V.over&&!V.alive.includes(U.me)&&!U.elimShown){U.elimShown=true;showMsgModal("ELIMINADO","Você perdeu todos os territórios. Continue acompanhando, conversando e fazendo alianças.")}
}

// ---------- desenho ----------
function canPlace(){
 if(!V||V.over||!V.alive.includes(U.me))return false;
 if(totalResIn(V,U.me)<=0)return false;
 return V.setup||(V.cur===U.me&&V.phase==="place");
}
function canDropOn(n){
 if(U.busy||!V||V.data[n].owner!==U.me)return false;
 if(U.draggingReserve)return canPlace();
 return myTurn()&&V.phase==="fortify";
}
function draw(){
 const svg=$("svg"),pieces=$("pieces");
 svg.innerHTML="";pieces.innerHTML="";
 TERRITORIES.forEach(t=>{
   const d=V.data[t.name],p=document.createElementNS(SVGNS,"path");
   p.setAttribute("d",t.d);
   p.setAttribute("class","zone"+(U.source===t.name?" attackSource":"")+(U.attack&&U.source&&ADJ[U.source].includes(t.name)&&d.owner!==U.me?" attackTarget":""));
   p.style.stroke=col(d.owner);p.style.fill=col(d.owner);
   p.onclick=()=>select(t.name);
   p.addEventListener("dragover",e=>{if(canDropOn(t.name))e.preventDefault()});
   p.addEventListener("drop",e=>{
     e.preventDefault();
     if(U.draggingReserve) placeTroop(t.name);
     else{const from=e.dataTransfer.getData("application/x-war-move");if(from)act({t:"fortify",from,to:t.name})}
   });
   svg.appendChild(p);
 });
 TERRITORIES.forEach(t=>{
   const d=V.data[t.name];
   const p=document.createElement("div");
   p.className="piece";p.style.background=col(d.owner);
   if(PCOLORS[V.pc[d.owner]].light){p.style.borderColor="#222";p.style.color="#111"}
   p.style.left=`calc(${t.cx/1500*100}% - 12px)`;p.style.top=`calc(${t.cy/1125*100}% - 12px)`;
   p.textContent=d.troops;p.title=`${t.name} — ${d.troops} tropas`;
   p.onclick=()=>select(t.name); // a peça fica por cima do mapa: repassa o clique
   p.draggable=d.owner===U.me&&myTurn()&&V.phase==="fortify";
   p.addEventListener("dragstart",e=>{
     if(U.busy||!myTurn()||V.phase!=="fortify"||V.data[t.name].owner!==U.me){e.preventDefault();return}
     e.dataTransfer.setData("application/x-war-move",t.name);
     e.dataTransfer.effectAllowed="move";
     p.classList.add("dragging");
   });
   p.addEventListener("dragend",()=>p.classList.remove("dragging"));
   p.addEventListener("dragover",e=>{if(canDropOn(t.name))e.preventDefault()});
   p.addEventListener("drop",e=>{
     e.preventDefault();
     if(U.draggingReserve){placeTroop(t.name);return}
     const from=e.dataTransfer.getData("application/x-war-move");
     if(from) act({t:"fortify",from,to:t.name});
   });
   pieces.appendChild(p);
 });
 renderTroopReserve();
}
function renderTroopReserve(){
 const box=$("troopReserve"),count=$("reserveCount");
 if(!box||!count||!V)return;
 const total=totalResIn(V,U.me);
 count.textContent=total;
 const det=[];if(V.res[U.me])det.push(`${V.res[U.me]} livres`);
 Object.entries(V.cres[U.me]||{}).forEach(([c,n])=>{if(n)det.push(`${n} só em ${c}`)});
 $("reserveDetail").textContent=det.length?`(${det.join(" • ")})`:"";
 box.innerHTML="";
 const ok=canPlace()&&!U.busy;
 for(let i=0;i<Math.min(8,total);i++){
   const p=document.createElement("div");
   p.className="palette-piece";
   p.style.background=col(U.me);
   p.title="Arraste para um território seu";
   p.draggable=ok;
   p.addEventListener("dragstart",e=>{
     if(!canPlace()||U.busy){e.preventDefault();return}
     U.draggingReserve=true;
     e.dataTransfer.setData("application/x-war-reserve","1");
     e.dataTransfer.effectAllowed="copy";
   });
   p.addEventListener("dragend",()=>{U.draggingReserve=false;});
   box.appendChild(p);
 }
}
function placeTroop(territory){
 U.draggingReserve=false;
 if(!canPlace()){log(V.over?"A partida acabou.":V.setup?"Você já posicionou todas as tropas iniciais.":V.cur!==U.me?"Não é seu turno.":"Agora não dá para posicionar tropas.");return}
 if(V.data[territory].owner!==U.me){log("Você só pode adicionar tropas em um território seu.");return}
 const c=BY_NAME[territory].continent;
 if(!(V.cres[U.me][c]>0)&&!(V.res[U.me]>0)){log("As tropas restantes são bônus de continente: só podem ficar dentro do próprio continente.");return}
 $("selection").innerHTML=`<b>+1 tropa</b> adicionada em ${territory}.`;
 act({t:"place",terr:territory});
}

// ---------- seleção / modos ----------
function select(n){
 if(!V||U.busy||V.over)return;
 if(U.attack&&myTurn()){
   if(!U.source){
     if(V.data[n].owner!==U.me){log("Escolha um território seu como origem.");return}
     if(V.data[n].troops<2){log(`${n} tem só 1 tropa — precisa de 2 ou mais para atacar.`);return}
     U.source=n;$("selection").innerHTML=`Origem: <b>${esc(n)}</b>. Agora clique no território inimigo vizinho.`;draw();return;
   }
   if(n===U.source){U.source=null;$("selection").innerHTML="Origem cancelada. Escolha o território de origem.";draw();return}
   if(V.data[n].owner===U.me){
     if(V.data[n].troops<2){log(`${n} tem só 1 tropa — precisa de 2 ou mais para atacar.`);return}
     U.source=n;$("selection").innerHTML=`Origem: <b>${esc(n)}</b>. Agora escolha um inimigo.`;draw();return}
   if(!ADJ[U.source].includes(n)){log("Esse ataque não é permitido: os territórios não são vizinhos.");return}
   if(V.ally!=null&&V.data[n].owner===V.ally){log("Esse território é do seu aliado secreto. Rompa a aliança no painel ALIANÇAS para atacá-lo.");return}
   chooseDice(U.source,n);return;
 }
 const d=V.data[n];
 $("selection").innerHTML=`<b>${esc(n)}</b> (${BY_NAME[n].continent})<br>Dono: ${esc(pn(d.owner))} — ${d.troops} tropas.<br>Vizinhos: ${ADJ[n].join(", ")}`;
}
function uiAttack(){
 if(!myTurn()||U.busy)return;
 if(V.phase==="fortify"){log("Você já está no remanejamento: só falta encerrar o turno.");return}
 if(V.phase==="place"){
   if(totalResIn(V,U.me)>0){log("Posicione todas as tropas da caixa antes de atacar.");return}
   U.attack=true;U.source=null;act({t:"phase",to:"attack"});
   $("selection").innerHTML="MODO ATAQUE: clique no seu território de origem (2+ tropas) e depois no vizinho inimigo.";
   return;
 }
 U.attack=!U.attack;U.source=null;
 $("selection").innerHTML=U.attack?"MODO ATAQUE: clique no seu território de origem (2+ tropas) e depois no vizinho inimigo.":"Modo ataque desligado.";
 draw();update();
}
function uiFortify(){
 if(!myTurn()||U.busy)return;
 if(V.phase==="fortify")return;
 if(totalResIn(V,U.me)>0){log("Posicione todas as tropas da caixa antes de continuar.");return}
 U.attack=false;U.source=null;act({t:"phase",to:"fortify"});
 $("selection").innerHTML="REMANEJAMENTO: arraste uma peça sua para outro território seu conectado (move 1 tropa por vez, sempre deixando 1). Depois encerre o turno.";
}
function uiEnd(){
 if(!myTurn()||U.busy)return;
 if(totalResIn(V,U.me)>0){log(`Você ainda tem ${totalResIn(V,U.me)} tropa(s) na caixa. Posicione todas antes de encerrar.`);return}
 act({t:"end"});
}

// ---------- cartas (UI) ----------
function toggleCard(i){
 if(U.sel.includes(i))U.sel=U.sel.filter(x=>x!==i);
 else if(U.sel.length<3)U.sel.push(i);
 update();
}
function doTrade(){
 if(!myTurn()||V.phase!=="place"){log("A troca de cartas só pode ser feita no início do seu turno, antes de atacar.");return}
 if(!validSet(U.sel.map(i=>V.hand[i]))){log("Combinação inválida: 3 do mesmo símbolo, 3 diferentes ou 2 quaisquer + coringa.");return}
 act({t:"trade",idx:U.sel});U.sel=[];
}
function toggleObj(){U.showObj=!U.showObj;update()}

// ---------- combate (UI) ----------
function dieHTML(x,cls){return `<span class="die ${cls}">${x}</span>`}
function openModal(title,result){
 $("combatTitle").textContent=title;$("combatResult").textContent=result||"";
 $("modal").classList.remove("hidden");
}
function chooseDice(from,to){
 const max=Math.min(3,V.data[from].troops-1);
 const box=$("diceChoice");
 openModal(`${from} ⚔ ${to}`,`Defensor (${pn(V.data[to].owner)}) tem ${V.data[to].troops} tropa(s) e usa até ${Math.min(3,V.data[to].troops)} dado(s). Empate favorece a defesa.`);
 $("dice").innerHTML="";
 $("combatContinue").style.visibility="hidden";
 box.innerHTML="";
 for(let n=1;n<=max;n++){
   const b=document.createElement("button");b.className="btn dicebtn";b.textContent=`${n} dado${n>1?"s":""}`;
   b.onclick=()=>{
     box.innerHTML="";
     startRoll(n,Math.min(3,V.data[to].troops));
     U.abortTimer=setTimeout(()=>{if(U.busy&&!U.gotEv)abortRoll()},5000);
     U.gotEv=false;
     act({t:"attack",from,to,n});
   };
   box.appendChild(b);
 }
 const c=document.createElement("button");c.className="btn cancelbtn";c.textContent="Cancelar";
 c.onclick=()=>{box.innerHTML="";$("combatContinue").style.visibility="visible";closeModal()};
 box.appendChild(c);
}
function startRoll(na,nd){
 U.busy=true;U.rollT0=Date.now();
 $("diceChoice").innerHTML="";$("combatContinue").style.visibility="hidden";
 $("combatResult").textContent="";
 const box=$("dice");
 box.innerHTML=Array(na).fill(dieHTML("⚄","roll atk")).join("")+" VS "+Array(nd).fill(dieHTML("⚄","roll def")).join("");
 clearInterval(U.rollTimer);
 U.rollTimer=setInterval(()=>box.querySelectorAll(".die").forEach(d=>d.textContent=1+Math.floor(Math.random()*6)),90);
}
function abortRoll(){
 clearInterval(U.rollTimer);U.busy=false;
 $("modal").classList.add("hidden");
 if(U.pending){V=U.pending;U.pending=null}
 render();
}
function showCombat(ev){
 U.gotEv=true;clearTimeout(U.abortTimer);
 if(!U.busy){openModal(`${ev.from} ⚔ ${ev.to}`,"");startRoll(ev.na,ev.nd)}
 const wait=Math.max(0,1300-(Date.now()-U.rollT0));
 setTimeout(()=>{
   clearInterval(U.rollTimer);
   $("dice").innerHTML=ev.ad.map(x=>dieHTML(x,"atk")).join("")+" VS "+ev.dd.map(x=>dieHTML(x,"def")).join("");
   const mineAtt=ev.att===U.me;
   $("combatTitle").textContent=`${ev.from} ⚔ ${ev.to}`;
   $("combatResult").textContent=ev.conquered?(mineAtt?`VOCÊ CONQUISTOU ${ev.to}!`:`${ev.attName} CONQUISTOU ${ev.to}!`)
     :(mineAtt?`Perdas — você: ${ev.al} | defensor: ${ev.dl}`:`Perdas — atacante: ${ev.al} | você: ${ev.dl}`);
   $("combatContinue").style.visibility="visible";
   U.busy=false;U.source=null;
   if(U.pending){V=U.pending;U.pending=null}
   render();
 },wait);
}
function closeModal(){
 if(U.busy)return;
 $("modal").classList.add("hidden");
}
function showMsgModal(t,msg){
 $("diceChoice").innerHTML="";$("dice").innerHTML="";
 openModal(t,msg);$("combatContinue").style.visibility="visible";
}
function showEnd(){
 const win=V.winner===U.me;
 const wait=U.busy?1600:300;
 setTimeout(()=>showMsgModal(win?"VITÓRIA!":"FIM DE JOGO",V.winner==null?V.winText:(win?`Você cumpriu seu objetivo!`:`${V.winText}`)),wait);
}
function newGame(){
 if(NET.mode!=="solo"){
  if(!confirm("Sair da sala e voltar ao menu?"))return;
  location.reload();return;
 }
 if(V&&!V.over&&!confirm("Abandonar a partida atual e começar outra?"))return;
 $("modal").classList.add("hidden");
 startSolo(true);
}

// ---------- interface ----------
function update(){
 if(!V)return;
 const mine=ownedIn(V,U.me);
 $("troops").textContent=mine.reduce((a,t)=>a+V.data[t.name].troops,0);
 $("territories").textContent=mine.length;
 const alive=V.alive.includes(U.me);
 const ph={place:"Posicionar tropas",attack:"Atacar",fortify:"Remanejar"}[V.phase]||"";
 let status;
 if(V.over)status="Fim de jogo";
 else if(!alive)status="Você foi eliminado";
 else if(V.setup)status=totalResIn(V,U.me)>0?"Posicionamento inicial":"Aguardando os outros jogadores…";
 else if(V.cur===U.me)status=`Seu turno — ${ph}`;
 else status=`Turno de ${V.names[V.cur]}${V.human[V.cur]?"":" (CPU)"}`;
 $("turn").textContent=status;
 $("colors").innerHTML=V.names.map((_,i)=>`<span style="${V.alive.includes(i)?"":"opacity:.35;text-decoration:line-through"}${V.cur===i&&!V.setup&&!V.over?";font-weight:700":""}"><i class="dot" style="background:${col(i)}"></i>${esc(V.names[i])}${i===U.me?" (você)":""} · ${ownedIn(V,i).length}t · ${V.handCounts[i]}🂠</span>`).join(" ");
 // botões
 const idle=!myTurn()||U.busy;
 const a=$("attackBtn"),f=$("fortifyBtn"),e=$("endBtn");
 a.textContent=U.attack?"✖ CANCELAR ATAQUE":"⚔ ATACAR";
 a.disabled=idle||V.phase==="fortify";f.disabled=idle||V.phase==="fortify";e.disabled=idle;
 renderTroopReserve();
 // objetivo secreto
 const o=V.obj;
 $("objText").textContent=!V.cfg.mission?"Missões secretas desativadas nesta sala: vence quem dominar o mundo."
  :U.showObj&&o?o.text+(o.auto?" (convertido: a cor-alvo não está em jogo, é a sua ou foi eliminada por outro)":""):"Objetivo oculto. Clique para ver (só você enxerga).";
 $("objBtn").style.display=V.cfg.mission?"":"none";
 $("objBtn").textContent=U.showObj?"🙈 ESCONDER":"👁 VER OBJETIVO";
 // cartas
 const hand=V.hand||[];
 U.sel=U.sel.filter(i=>i<hand.length);
 $("hand").innerHTML=hand.length?hand.map((c,i)=>`<button class="card-chip${U.sel.includes(i)?" sel":""}${c.wild?" wild":""}" onclick="toggleCard(${i})"><b>${c.sym}</b> ${esc(c.t)}</button>`).join(""):"<i>Nenhuma carta. Conquiste ao menos 1 território no turno para comprar 1 carta.</i>";
 $("tradeInfo").textContent=`Próxima troca vale ${tradeValue(V.trades+1)} exércitos (+2 em cada território da carta que você controla).`;
 $("tradeBtn").disabled=!(myTurn()&&!U.busy&&V.phase==="place"&&validSet(U.sel.map(i=>hand[i])));
}
